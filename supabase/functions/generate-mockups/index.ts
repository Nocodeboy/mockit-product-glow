
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
    console.log("🚀 === Generate mockups function started ===");

    // Check for required environment variables
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      console.error('❌ REPLICATE_API_KEY is not configured')
      throw new Error('REPLICATE_API_KEY is not set')
    }
    console.log("✅ REPLICATE_API_KEY found successfully");

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

    console.log("🖼️ Image URL type:", imageUrl.startsWith('data:') ? "base64" : "url");
    console.log("📏 Image URL length:", imageUrl.length);

    // Initialize Replicate client
    console.log("🔧 Initializing Replicate client...");
    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })
    console.log("✅ Replicate client initialized");

    // Test simple prompt first
    const testPrompt = "Transform this into a professional studio product photo with clean white background and perfect commercial lighting";
    
    console.log("\n🧪 === Starting TEST Generation ===");
    console.log("📝 Test prompt:", testPrompt);
    
    try {
      console.log("⏰ Starting Replicate call at:", new Date().toISOString());
      
      // Prepare input according to flux-kontext-pro documentation
      const input = {
        prompt: testPrompt,
        input_image: imageUrl
      };
      
      console.log("📤 Calling replicate.run with model: black-forest-labs/flux-kontext-pro");
      console.log("📦 Input keys:", Object.keys(input));
      
      // Set a timeout to avoid hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Replicate call timed out after 60 seconds')), 60000);
      });
      
      const replicatePromise = replicate.run("black-forest-labs/flux-kontext-pro", { input });
      
      console.log("⏳ Waiting for Replicate response...");
      const output = await Promise.race([replicatePromise, timeoutPromise]);
      
      console.log("🎉 Replicate call completed successfully!");
      console.log("📦 Raw output type:", typeof output);
      console.log("📦 Raw output:", output);

      // Process response
      let resultUrl = null;
      
      if (typeof output === 'string') {
        resultUrl = output;
        console.log("✅ Output is direct URL string");
      } else if (Array.isArray(output) && output.length > 0) {
        resultUrl = output[0];
        console.log("✅ Output is array, took first element");
      } else if (output && typeof output === 'object') {
        resultUrl = output.url || output.image_url || output.output || output.result;
        console.log("✅ Output is object, extracted URL property");
      }

      if (!resultUrl || typeof resultUrl !== 'string') {
        console.error("❌ No valid URL found in response:", output);
        throw new Error('No valid image URL in Replicate response');
      }

      // Validate URL
      try {
        new URL(resultUrl);
        console.log("✅ Generated URL is valid:", resultUrl);
      } catch {
        console.error("❌ Invalid URL format:", resultUrl);
        throw new Error('Generated URL is not valid');
      }

      // Return single successful result for now
      const response = {
        mockups: [resultUrl],
        total_generated: 1,
        total_requested: 1,
        model_used: "black-forest-labs/flux-kontext-pro",
        test_mode: true
      };

      console.log("🎊 SUCCESS! Returning response with 1 mockup");
      
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (replicateError) {
      console.error("💥 Replicate API Error:");
      console.error("- Error name:", replicateError.name);
      console.error("- Error message:", replicateError.message);
      console.error("- Error stack:", replicateError.stack?.substring(0, 500));
      
      throw new Error(`Replicate API failed: ${replicateError.message}`);
    }

  } catch (error) {
    console.error("💥 CRITICAL ERROR in generate-mockups function:");
    console.error("- Error name:", error.name);
    console.error("- Error message:", error.message);
    console.error("- Error stack:", error.stack?.substring(0, 1000));
    console.error("- Timestamp:", new Date().toISOString());
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
      debug_info: {
        error_type: error.name,
        function: "generate-mockups",
        replicate_api_configured: !!Deno.env.get('REPLICATE_API_KEY'),
        user_authenticated: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
