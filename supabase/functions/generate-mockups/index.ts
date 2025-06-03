
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("🚀 Generate mockups function started");

    // Check for required environment variables
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      console.error('❌ REPLICATE_API_KEY is not configured')
      throw new Error('REPLICATE_API_KEY is not set')
    }
    console.log("✅ REPLICATE_API_KEY found");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("❌ No authorization header provided");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      console.error("❌ User not authenticated or no email");
      throw new Error("Usuario no autenticado");
    }

    console.log("✅ User authenticated:", user.email);

    const body = await req.json()
    console.log("📝 Request body received");
    const { imageUrl, style = "professional" } = body

    // Validaciones de entrada
    if (!imageUrl) {
      console.error('❌ No imageUrl provided in request')
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: imageUrl is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("🖼️ Processing image URL");

    // Initialize Replicate client
    console.log("🔧 Initializing Replicate client...");
    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })
    console.log("✅ Replicate client initialized");

    // Create a professional mockup prompt
    const prompt = "Transform this product into a professional studio product photo with clean white background, perfect commercial lighting, and high-end presentation style";
    
    console.log("🎨 Starting mockup generation");
    console.log("📝 Using prompt:", prompt);
    
    try {
      console.log("⏰ Making Replicate API call...");
      
      // Use the correct model and input format
      const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
        input: {
          prompt: prompt,
          input_image: imageUrl
        }
      });
      
      console.log("🎉 Replicate call completed!");
      console.log("📦 Output received:", typeof output, output);

      // Process the output
      let resultUrl = null;
      
      if (typeof output === 'string') {
        resultUrl = output;
        console.log("✅ Direct URL result");
      } else if (Array.isArray(output) && output.length > 0) {
        resultUrl = output[0];
        console.log("✅ Array result, using first item");
      } else if (output && typeof output === 'object') {
        // Try different possible properties
        resultUrl = output.url || output.image_url || output.output || output.result;
        console.log("✅ Object result, extracted URL");
      }

      if (!resultUrl || typeof resultUrl !== 'string') {
        console.error("❌ No valid URL found in output:", output);
        throw new Error('No se pudo obtener una URL válida del resultado');
      }

      // Validate the URL
      try {
        new URL(resultUrl);
        console.log("✅ Valid URL generated:", resultUrl.substring(0, 100));
      } catch {
        console.error("❌ Invalid URL format:", resultUrl);
        throw new Error('URL generada no es válida');
      }

      // Return successful response
      const response = {
        mockups: [resultUrl],
        total_generated: 1,
        total_requested: 1,
        model_used: "black-forest-labs/flux-kontext-pro"
      };

      console.log("🎊 SUCCESS! Returning mockup");
      
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (replicateError) {
      console.error("💥 Replicate API Error:", replicateError);
      throw new Error(`Error en Replicate API: ${replicateError.message}`);
    }

  } catch (error) {
    console.error("💥 CRITICAL ERROR:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || "Error inesperado",
      timestamp: new Date().toISOString(),
      debug_info: {
        function: "generate-mockups",
        replicate_configured: !!Deno.env.get('REPLICATE_API_KEY')
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
