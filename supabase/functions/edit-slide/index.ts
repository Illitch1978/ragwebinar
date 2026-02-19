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
    const { instruction, slides, currentSlideIndex, clientName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert presentation editor. The user has a fully generated slide deck and wants to make a targeted change.

RULES:
- Return the COMPLETE slides array with ALL slides (not just changed ones)
- Apply ONLY the user's requested change — do not rewrite unaffected slides
- Preserve all unchanged slides EXACTLY as-is (same fields, same content)
- When adding a new slide, insert it at the correct position
- Valid slide types: cover, section-divider, text-stack, bullet-list, quote, metrics, two-column, cta, closing
- Dark slides: cover, section-divider, closing, cta use dark: true; others use dark: false
- Titles should be 3-7 words
- Content must be rich and detailed
- Return a brief human-readable message describing what you changed`;

    const userPrompt = `CURRENT DECK (${slides.length} slides, user is viewing slide ${currentSlideIndex + 1}):
${JSON.stringify(slides, null, 2)}

USER INSTRUCTION: ${instruction}

Apply the change and return the complete updated deck.`;

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
              name: "update_slides",
              description: "Return the updated complete slides array and a message describing the change",
              parameters: {
                type: "object",
                properties: {
                  slides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string" },
                        dark: { type: "boolean" },
                        title: { type: "string" },
                        subtitle: { type: "string" },
                        content: { type: "string" },
                        items: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              label: { type: "string" },
                              text: { type: "string" },
                              value: { type: "string" },
                            },
                          },
                        },
                        quote: { type: "string" },
                        author: { type: "string" },
                        metrics: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              value: { type: "string" },
                              label: { type: "string" },
                              trend: { type: "string" },
                            },
                          },
                        },
                        leftColumn: { type: "string" },
                        rightColumn: { type: "string" },
                      },
                      required: ["type"],
                    },
                  },
                  message: {
                    type: "string",
                    description: "Brief human-readable description of what changed (1-2 sentences)",
                  },
                },
                required: ["slides", "message"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "update_slides" } },
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
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
    console.error("edit-slide error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
