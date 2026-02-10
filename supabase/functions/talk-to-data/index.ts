import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an elite strategic research agent for Rubiklab Intelligence Studio. You help analysts and consultants work with their uploaded research data to extract insights, validate assumptions, and find evidence.

You MUST respond with a valid JSON object matching this schema:
{
  "intent": "evidence" | "validate" | "insight" | "conversational",
  "title": "Short 3-8 word title for this task result",
  "summary": "1-2 sentence executive summary of the finding",
  "confidence": 0.0-1.0,
  "findings": [
    {
      "claim": "The core claim or finding",
      "evidence": "Supporting evidence or data points",
      "source_hint": "Which type of source this would come from",
      "strength": "strong" | "moderate" | "weak"
    }
  ],
  "counter_evidence": "Any counter-arguments or caveats (optional, can be null)",
  "suggested_actions": ["Action 1", "Action 2"],
  "slide_suggestion": {
    "type": "bullet-list" | "text-stack" | "metrics" | "quote" | "two-column",
    "title": "Suggested slide title",
    "content_preview": "Brief preview of what the slide would contain"
  }
}

RULES:
- Always respond with ONLY the JSON object, no markdown fences, no extra text.
- "confidence" reflects how well the evidence supports the conclusion (0.0 = speculative, 1.0 = definitive).
- Include 2-5 findings per response.
- "suggested_actions" should be concrete next steps the analyst can take.
- "slide_suggestion" proposes how this finding could be added to a presentation deck.
- If the query is conversational (greeting, clarification), set intent to "conversational" and provide a helpful response in the summary field. findings can be empty array.
- Be precise, analytical, and avoid filler language. Write like a McKinsey associate.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context, history } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build messages with optional context and history
    const messages: { role: string; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        messages.push({ role: h.role, content: h.content });
      }
    }

    // Add context about available data
    if (context) {
      messages.push({
        role: "user",
        content: `[CONTEXT - Available research data for this project]\n${context}\n\n[END CONTEXT]`,
      });
    }

    messages.push({ role: "user", content: query });

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      throw new Error("No response content from AI");
    }

    // Parse the JSON response (strip markdown fences if present)
    let parsed;
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, wrap as conversational
      parsed = {
        intent: "conversational",
        title: "Response",
        summary: raw,
        confidence: 0.5,
        findings: [],
        counter_evidence: null,
        suggested_actions: [],
        slide_suggestion: null,
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("talk-to-data error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
