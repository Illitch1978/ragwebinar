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

// Global instructions that apply to ALL brand guides
const GLOBAL_GENERATION_RULES = `
CRITICAL DESIGN RULES (always follow):
1. NEVER have two consecutive slides with exactly the same design/type. Vary the visual rhythm.
2. Insert a section-divider slide every 5-10 content slides to break up the flow.
3. Alternate between dark and light slides where appropriate for visual contrast.
4. Use quote slides sparingly - maximum 2-3 per presentation.
5. Metrics slides should highlight 2-4 key numbers, not more.
6. Cover slide must establish the brand immediately.
7. Closing slide should have a clear call-to-action or next steps.
8. NEVER include navigation arrows or exit buttons - navigation is handled by clicking the logo.
9. The brand logo appears ONCE per slide in the bottom-left corner - NEVER duplicate logos.
10. TITLE RULE: If no title is provided, generate an appropriate, compelling title based on the content. The title should be concise (3-6 words) and capture the essence of the presentation. NEVER use generic titles like "Strategic Intelligence Report" - always be specific to the content.
11. ANIMATION RULE: Text reveal animations must be smooth and elegant - NEVER shaky or jittery. Use ease-out timing functions with subtle vertical movement (8-12px max).
12. CONTRAST RULE: ALWAYS ensure proper text-to-background contrast. Dark backgrounds (black, navy) use white/light text. Light backgrounds (cream, white) use dark/black text. Quote slides, CTA slides, cover slides, section-dividers, and closing slides MUST use dark backgrounds with light text.
`;

// Slide count targets based on length preference
const LENGTH_TARGETS: Record<string, { min: number; max: number; description: string }> = {
  brief: { min: 8, max: 12, description: "Brief executive summary" },
  medium: { min: 13, max: 22, description: "Standard presentation" },
  long: { min: 23, max: 30, description: "Comprehensive deep-dive" },
  "very-long": { min: 31, max: 45, description: "Full workshop/training deck" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, clientName, brandGuide, instructions, length = "medium" } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lengthTarget = LENGTH_TARGETS[length] || LENGTH_TARGETS.medium;

    const systemPrompt = `You are an expert presentation designer. Your job is to transform raw content into a structured presentation deck.

You will be given:
1. Raw content (text, markdown, notes)
2. A brand guide with design system and slide templates
3. Optional instructions from the user
4. A target length for the presentation

Your output must be a JSON array of slides. Each slide should match one of the templates from the brand guide.

${GLOBAL_GENERATION_RULES}

BRAND GUIDE:
${JSON.stringify(brandGuide, null, 2)}

TARGET LENGTH: ${lengthTarget.min}-${lengthTarget.max} slides (${lengthTarget.description})

NARRATIVE STRUCTURE:
1. Create a compelling narrative arc: Opening → Context → Problem → Solution → Evidence → Call to Action
2. Use the slide types from the brand guide templates
3. Keep text concise - presentations should be visual, not text-heavy
4. Extract key metrics, quotes, and insights from the content
5. Always start with a cover slide and end with a closing slide
6. Use section dividers to break up major topics (every 5-10 slides)

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
                        authorEmail: { type: "string", description: "Email address of the quote author if mentioned in source content" },
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
