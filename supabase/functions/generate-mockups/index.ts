
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
    console.log("Request body received:", JSON.stringify(body, null, 2));
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

    // Log del tipo de imagen recibida
    const isBase64 = imageUrl.startsWith('data:image/');
    const isUrl = !isBase64;
    console.log("Image type detected:", isBase64 ? "base64" : "url");
    console.log("Image source preview:", imageUrl.substring(0, 100) + "...");

    // Para flux-kontext-pro, podemos usar tanto base64 como URLs directamente
    let processedImageUrl = imageUrl;
    
    // Si es base64, lo usamos directamente ya que Replicate lo acepta
    if (isBase64) {
      console.log("Using base64 image directly");
    } else {
      // Validar que sea una URL válida si no es base64
      try {
        new URL(imageUrl);
        console.log("Using URL image directly");
      } catch {
        console.error('Invalid imageUrl format provided:', imageUrl.substring(0, 100));
        return new Response(
          JSON.stringify({ 
            error: "Invalid imageUrl format" 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        )
      }
    }

    console.log("=== Starting mockup generation with black-forest-labs/flux-kontext-pro ===");

    // Prompts específicos y optimizados para transformar productos
    const productTransformationPrompts = [
      "Transform this into a professional studio product photo with clean white background and perfect commercial lighting",
      "Make this an elegant luxury product shot on marble surface with soft natural lighting and premium aesthetic",
      "Convert this to a modern lifestyle product photo in contemporary office setting with natural daylight",
      "Transform into premium e-commerce product photography with gradient background and studio lighting",
      "Make this a professional product photo in natural setting with warm ambient lighting and authentic context",
      "Convert to dramatic luxury product showcase with dark background and accent lighting",
      "Transform into bright, airy product photography with soft diffused lighting and clean white background",
      "Make this an artisanal product photo on wooden surface with natural textures and warm lighting"
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
        
        // Preparar input para flux-kontext-pro
        const replicateInput = {
          prompt: productTransformationPrompts[i],
          input_image: processedImageUrl
        };
        
        console.log("Replicate input prepared:", {
          prompt: replicateInput.prompt,
          input_image_type: isBase64 ? "base64" : "url",
          input_image_preview: replicateInput.input_image.substring(0, 100) + "..."
        });

        console.log("Calling replicate.run with black-forest-labs/flux-kontext-pro...");
        const output = await replicate.run(
          "black-forest-labs/flux-kontext-pro",
          {
            input: replicateInput
          }
        );
        
        const duration = Date.now() - startTime;
        console.log(`Replicate call completed in ${duration}ms`);
        console.log("Raw output from Replicate:", typeof output, output);

        // Procesar la respuesta
        let imageUrl = null;
        
        if (typeof output === 'string') {
          // Si es una string directa (URL)
          imageUrl = output;
          console.log("Output is direct URL string");
        } else if (Array.isArray(output) && output.length > 0) {
          // Si es un array, tomar el primer elemento
          imageUrl = output[0];
          console.log("Output is array, taking first element");
        } else if (output && typeof output === 'object') {
          // Si es un objeto, buscar propiedades comunes para URLs de imagen
          imageUrl = output.url || output.image_url || output.output || output.result;
          console.log("Output is object, extracted URL");
        }

        if (imageUrl && typeof imageUrl === 'string') {
          try {
            new URL(imageUrl);
            mockups.push(imageUrl);
            console.log(`✅ Successfully generated mockup ${i + 1}: ${imageUrl}`);
          } catch {
            console.error(`❌ Invalid URL format for mockup ${i + 1}:`, imageUrl);
            errors.push(`Mockup ${i + 1}: Invalid URL format - ${imageUrl}`);
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
          stack: error.stack
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
            input_image_type: isBase64 ? "base64" : "url",
            prompts_attempted: productTransformationPrompts.length
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
    console.log("Response:", JSON.stringify(response, null, 2));
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("💥 CRITICAL ERROR in generate-mockups function:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
      debug_info: {
        error_type: error.name,
        function: "generate-mockups"
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
