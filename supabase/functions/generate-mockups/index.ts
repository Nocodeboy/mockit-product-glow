
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
    console.log("=== Generate mockups function started ===");

    // Check for required environment variables
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      console.error('REPLICATE_API_KEY is not configured')
      throw new Error('REPLICATE_API_KEY is not set')
    }
    console.log("REPLICATE_API_KEY found successfully");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) {
      console.error("User not authenticated or no email");
      throw new Error("Usuario no autenticado");
    }

    console.log("User authenticated:", user.email);

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })
    console.log("Replicate client initialized");

    const body = await req.json()
    console.log("Request body received");
    const { imageUrl, style = "professional" } = body

    // Validaciones de entrada
    if (!imageUrl) {
      console.error('No imageUrl provided in request')
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: imageUrl is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Image URL received, length:", imageUrl.length);

    // Prompts específicos para transformar productos
    const productTransformationPrompts = [
      "Transform this into a professional studio product photo with clean white background and perfect commercial lighting",
      "Make this an elegant luxury product shot on marble surface with soft natural lighting and premium aesthetic",
      "Convert this to a modern lifestyle product photo in contemporary office setting with natural daylight",
      "Transform into premium e-commerce product photography with gradient background and studio lighting"
    ];

    const mockups = [];
    const errors = [];

    console.log(`Starting generation of ${productTransformationPrompts.length} mockups`);

    // Generar cada mockup con manejo individual de errores
    for (let i = 0; i < productTransformationPrompts.length; i++) {
      try {
        console.log(`\n--- Generating mockup ${i + 1}/${productTransformationPrompts.length} ---`);
        console.log(`Prompt: "${productTransformationPrompts[i]}"`);
        
        const startTime = Date.now();
        
        // Preparar input para flux-kontext-pro según la documentación oficial
        const replicateInput = {
          prompt: productTransformationPrompts[i],
          input_image: imageUrl
        };
        
        console.log("Calling replicate.run with black-forest-labs/flux-kontext-pro...");
        console.log("Input prepared:", {
          prompt: replicateInput.prompt,
          input_image_type: imageUrl.startsWith('data:') ? "base64" : "url",
          input_image_length: imageUrl.length
        });

        const output = await replicate.run(
          "black-forest-labs/flux-kontext-pro",
          {
            input: replicateInput
          }
        );
        
        const duration = Date.now() - startTime;
        console.log(`Replicate call completed in ${duration}ms`);
        console.log("Raw output from Replicate:", typeof output, output);

        // Procesar la respuesta - flux-kontext-pro devuelve una URL directamente
        let imageUrl_result = null;
        
        if (typeof output === 'string') {
          // Si es una string directa (URL)
          imageUrl_result = output;
          console.log("Output is direct URL string");
        } else if (Array.isArray(output) && output.length > 0) {
          // Si es un array, tomar el primer elemento
          imageUrl_result = output[0];
          console.log("Output is array, taking first element");
        } else if (output && typeof output === 'object') {
          // Si es un objeto, buscar propiedades comunes para URLs de imagen
          imageUrl_result = output.url || output.image_url || output.output || output.result;
          console.log("Output is object, extracted URL");
        }

        if (imageUrl_result && typeof imageUrl_result === 'string') {
          try {
            new URL(imageUrl_result);
            mockups.push(imageUrl_result);
            console.log(`✅ Successfully generated mockup ${i + 1}: ${imageUrl_result}`);
          } catch {
            console.error(`❌ Invalid URL format for mockup ${i + 1}:`, imageUrl_result);
            errors.push(`Mockup ${i + 1}: Invalid URL format - ${imageUrl_result}`);
          }
        } else {
          console.error(`❌ No valid image URL found in output for mockup ${i + 1}:`, output);
          errors.push(`Mockup ${i + 1}: No valid image URL in response`);
        }

      } catch (error) {
        console.error(`❌ Error generating mockup ${i + 1}:`, error);
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack?.substring(0, 500)
        });
        errors.push(`Mockup ${i + 1}: ${error.message || 'Unknown error'}`);
      }
    }

    console.log(`\n=== Generation Summary ===`);
    console.log(`Successful mockups: ${mockups.length}`);
    console.log(`Failed attempts: ${errors.length}`);
    
    // Si no se generó ningún mockup, devolver error detallado
    if (mockups.length === 0) {
      console.error('❌ No mockups were generated successfully');
      console.error('All errors:', errors);
      return new Response(
        JSON.stringify({ 
          error: "No se pudieron generar mockups",
          details: errors,
          debug_info: {
            model_used: "black-forest-labs/flux-kontext-pro",
            input_image_type: imageUrl.startsWith('data:') ? "base64" : "url",
            prompts_attempted: productTransformationPrompts.length,
            replicate_api_configured: !!REPLICATE_API_KEY
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Preparar respuesta exitosa
    const response = {
      mockups,
      total_generated: mockups.length,
      total_requested: productTransformationPrompts.length,
      model_used: "black-forest-labs/flux-kontext-pro",
      ...(errors.length > 0 && { warnings: errors })
    };

    console.log(`✅ Returning ${mockups.length} successful mockups`);
    console.log("Response prepared successfully");
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("💥 CRITICAL ERROR in generate-mockups function:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack?.substring(0, 1000));
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
      debug_info: {
        error_type: error.name,
        function: "generate-mockups",
        replicate_api_configured: !!Deno.env.get('REPLICATE_API_KEY')
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
