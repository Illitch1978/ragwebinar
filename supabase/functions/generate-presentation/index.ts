import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BrandGuide {
  name: string;
  design_system: {
    theme: string;
    typography: string;
    colors: string;
    style_notes: string;
  };
  slide_templates: Array<{
    type: string;
    description: string;
    structure: string;
  }>;
}

interface SlideOutput {
  type: string;
  dark?: boolean;
  title?: string;
  subtitle?: string;
  content?: any;
  metadata?: any;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, clientName, brandGuide, instructions } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert presentation designer. Your job is to transform raw content into a structured presentation deck.

You will be given:
1. Raw content (text, markdown, notes)
2. A brand guide with design system and slide templates
3. Optional instructions from the user

Your output must be a JSON array of slides. Each slide should match one of the templates from the brand guide.

BRAND GUIDE:
${JSON.stringify(brandGuide, null, 2)}

RULES:
1. Create a compelling narrative arc: Opening → Context → Problem → Solution → Evidence → Call to Action
2. Use the slide types from the brand guide templates
3. Keep text concise - presentations should be visual, not text-heavy
4. Extract key metrics, quotes, and insights from the content
5. Create 15-25 slides for a comprehensive presentation
6. Always start with a cover slide and end with a closing slide
7. Use section dividers to break up major topics

OUTPUT FORMAT:
Return a JSON array of slide objects. Each slide must have:
- type: string (matching a template type from the brand guide)
- Any fields required by that template type (title, subtitle, content, items, etc.)`;

    const userPrompt = `Create a presentation from this content:

---
CLIENT NAME: ${clientName || 'Presentation'}
---
CONTENT:
${content}
---
${instructions ? `ADDITIONAL INSTRUCTIONS:\n${instructions}` : ''}

Generate the slides JSON array now.`;

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
              name: "generate_slides",
              description: "Generate the presentation slides as a structured array",
              parameters: {
                type: "object",
                properties: {
                  slides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { 
                          type: "string",
                          enum: ["cover", "section-divider", "text-stack", "bullet-list", "quote", "metrics", "two-column", "image-full", "cta", "closing"]
                        },
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
                              value: { type: "string" }
                            }
                          }
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
                              trend: { type: "string" }
                            }
                          }
                        },
                        leftColumn: { type: "string" },
                        rightColumn: { type: "string" }
                      },
                      required: ["type"]
                    }
                  }
                },
                required: ["slides"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_slides" } }
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
    
    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "generate_slides") {
      throw new Error("Invalid response from AI");
    }

    const slidesData = JSON.parse(toolCall.function.arguments);
    
    return new Response(JSON.stringify({ slides: slidesData.slides }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("generate-presentation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
