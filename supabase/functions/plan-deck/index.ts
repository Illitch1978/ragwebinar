import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objectives, collectedItems, existingStructure, editInstruction, mode } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "suggest") {
      // Stage 1: Suggest initial 20-slide structure
      systemPrompt = `You are an expert presentation strategist. Given project objectives and collected research artifacts, suggest a compelling 20-slide deck structure.

RULES:
- Always start with a cover slide and end with a closing/CTA slide
- Include 2-3 section dividers to break up major themes
- Every slide must have a type, a compelling title (3-7 words), and a 1-sentence brief description of what goes on that slide
- Draw directly from the collected research items where relevant
- Follow a narrative arc: Context → Problem → Insight → Solution → Evidence → Action
- Slide types: cover, section-divider, text-stack, bullet-list, quote, metrics, two-column, cta, closing
- Quotes should reference the actual speaker from collected items
- Metrics slides should reference actual data points from collected items
- Make the structure feel tailored to the specific objectives, not generic`;

      userPrompt = `PROJECT OBJECTIVES:
${objectives}

COLLECTED RESEARCH ITEMS:
${collectedItems && collectedItems.length > 0
  ? collectedItems.map((item: any, i: number) => `[${i + 1}] ${item.type.toUpperCase()} (from ${item.source}): ${item.title}\n${item.content}`).join('\n\n')
  : "No items collected yet — generate structure based on objectives alone."
}

Suggest a 20-slide deck structure now.`;
    } else if (mode === "edit") {
      // Stage 2: Targeted edit to existing structure
      systemPrompt = `You are an expert presentation editor. The user has a deck structure and wants to make a specific change. Apply ONLY the requested change — do not rewrite other slides.

RULES:
- Return the COMPLETE updated slides array with ALL slides (not just the changed ones)
- Apply the user's instruction precisely
- Preserve all unchanged slides exactly as-is
- Slide types: cover, section-divider, text-stack, bullet-list, quote, metrics, two-column, cta, closing
- Each slide must have: type, title, brief (1-sentence description)`;

      userPrompt = `CURRENT DECK STRUCTURE:
${JSON.stringify(existingStructure, null, 2)}

USER INSTRUCTION:
${editInstruction}

Apply the change and return the complete updated structure.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "deck_structure",
              description: "Return the deck slide structure",
              parameters: {
                type: "object",
                properties: {
                  slides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        index: { type: "number", description: "1-based slide number" },
                        type: {
                          type: "string",
                          enum: ["cover", "section-divider", "text-stack", "bullet-list", "quote", "metrics", "two-column", "cta", "closing"],
                        },
                        title: { type: "string", description: "Slide title, 3-7 words" },
                        brief: { type: "string", description: "One sentence: what this slide communicates" },
                        sourceRef: { type: "string", description: "If this slide references a collected item, describe which one" },
                      },
                      required: ["index", "type", "title", "brief"],
                    },
                  },
                  rationale: {
                    type: "string",
                    description: "1-2 sentence explanation of the narrative arc chosen",
                  },
                },
                required: ["slides"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "deck_structure" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("plan-deck error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
