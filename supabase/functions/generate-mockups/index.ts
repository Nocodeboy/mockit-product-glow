
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
    console.log("Generate mockups function started");

    // Check for required environment variables
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      console.error('REPLICATE_API_KEY is not configured')
      throw new Error('REPLICATE_API_KEY is not set')
    }

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

    const body = await req.json()
    const { imageUrl, style = "professional" } = body

    // Validaciones de entrada más robustas
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

    // Validar que imageUrl sea una URL válida o base64
    let isValidUrl = false;
    try {
      new URL(imageUrl);
      isValidUrl = true;
    } catch {
      // Check if it's base64
      if (!imageUrl.startsWith('data:image/')) {
        console.error('Invalid imageUrl provided:', imageUrl.substring(0, 100));
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

    console.log("Starting mockup generation using black-forest-labs/flux-kontext-pro for image:", imageUrl.substring(0, 100));

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

    console.log(`Starting generation of ${productTransformationPrompts.length} mockups using black-forest-labs/flux-kontext-pro`);

    // Generar cada mockup usando black-forest-labs/flux-kontext-pro con manejo individual de errores
    for (let i = 0; i < productTransformationPrompts.length; i++) {
      try {
        console.log(`Generating mockup ${i + 1}/${productTransformationPrompts.length} with black-forest-labs/flux-kontext-pro. Prompt: ${productTransformationPrompts[i]}`);
        
        const startTime = Date.now();
        const output = await replicate.run(
          "black-forest-labs/flux-kontext-pro",
          {
            input: {
              prompt: productTransformationPrompts[i],
              input_image: imageUrl
            }
          }
        );
        const duration = Date.now() - startTime;

        console.log(`Black-forest-labs/flux-kontext-pro response for mockup ${i + 1}:`, output);

        // flux-kontext-pro returns a single image URL directly
        if (output && typeof output === 'string') {
          try {
            new URL(output);
            mockups.push(output);
            console.log(`Successfully generated mockup ${i + 1} with black-forest-labs/flux-kontext-pro in ${duration}ms`);
          } catch {
            console.error(`Invalid URL output for mockup ${i + 1}:`, output);
            errors.push(`Mockup ${i + 1}: Invalid URL format`);
          }
        } else if (output && Array.isArray(output) && output.length > 0) {
          // Fallback if it returns an array
          const imageUrl = output[0];
          try {
            new URL(imageUrl);
            mockups.push(imageUrl);
            console.log(`Successfully generated mockup ${i + 1} with black-forest-labs/flux-kontext-pro in ${duration}ms`);
          } catch {
            console.error(`Invalid URL output for mockup ${i + 1}:`, imageUrl);
            errors.push(`Mockup ${i + 1}: Invalid URL format`);
          }
        } else {
          console.error(`Invalid output format for mockup ${i + 1}:`, output);
          errors.push(`Mockup ${i + 1}: Invalid output format`);
        }
      } catch (error) {
        console.error(`Error generating mockup ${i + 1} with black-forest-labs/flux-kontext-pro:`, error);
        errors.push(`Mockup ${i + 1}: ${error.message || 'Unknown error'}`);
        // Continuar con el siguiente mockup si uno falla
      }
    }

    console.log(`Generation completed with black-forest-labs/flux-kontext-pro. Success: ${mockups.length}, Errors: ${errors.length}`);
    
    // Si no se generó ningún mockup, devolver error
    if (mockups.length === 0) {
      console.error('No mockups were generated successfully with black-forest-labs/flux-kontext-pro. Errors:', errors);
      return new Response(
        JSON.stringify({ 
          error: "No se pudieron generar mockups",
          details: errors
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Si se generaron algunos mockups pero hubo errores, incluir información de errores
    const response = {
      mockups,
      total_generated: mockups.length,
      total_requested: productTransformationPrompts.length,
      model_used: "black-forest-labs/flux-kontext-pro",
      ...(errors.length > 0 && { warnings: errors })
    };

    console.log(`Returning ${mockups.length} successful mockups generated with black-forest-labs/flux-kontext-pro`);
    
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Critical error in generate-mockups function:", error)
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred",
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
