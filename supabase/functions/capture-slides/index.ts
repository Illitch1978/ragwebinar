import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CaptureRequest {
  presentationId: string;
  slideCount: number;
  baseUrl: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { presentationId, slideCount, baseUrl } = await req.json() as CaptureRequest;

    if (!presentationId || !slideCount || !baseUrl) {
      return new Response(
        JSON.stringify({ error: "Missing presentationId, slideCount, or baseUrl" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Capturing ${slideCount} slides for presentation ${presentationId}`);

    const screenshotUrls: string[] = [];

    // Use screenshotone.com API (or similar) to capture each slide
    // For now, we'll use a simpler approach: return URLs for client-side capture
    // The client will use html2canvas to capture and upload screenshots
    
    for (let i = 0; i < slideCount; i++) {
      const slideUrl = `${baseUrl}/presentation?id=${presentationId}&slide=${i}&export=true`;
      
      // Generate a unique filename for each slide
      const filename = `${presentationId}/slide-${String(i + 1).padStart(3, "0")}.png`;
      
      screenshotUrls.push({
        slideIndex: i,
        captureUrl: slideUrl,
        storagePath: filename,
      } as any);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        slides: screenshotUrls,
        message: "Use client-side capture for each slide URL"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in capture-slides:", error);
    const message = error instanceof Error ? error.message : "Failed to capture slides";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
