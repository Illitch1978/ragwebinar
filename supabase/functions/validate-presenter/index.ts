import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    
    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Password required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storedPassword = Deno.env.get('PRESENTER_PASSWORD');
    
    if (!storedPassword) {
      console.error('PRESENTER_PASSWORD secret not configured');
      return new Response(
        JSON.stringify({ valid: false, error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const isValid = password === storedPassword;

    return new Response(
      JSON.stringify({ valid: isValid }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});