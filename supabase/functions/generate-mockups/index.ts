
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

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
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      console.error('REPLICATE_API_KEY is not configured')
      throw new Error('REPLICATE_API_KEY is not set')
    }

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

    // Validar que imageUrl sea una URL válida
    try {
      new URL(imageUrl);
    } catch {
      console.error('Invalid imageUrl provided:', imageUrl)
      return new Response(
        JSON.stringify({ 
          error: "Invalid imageUrl format" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Starting mockup generation using flux-kontext-pro for image:", imageUrl)

    // Prompts específicos y optimizados para transformar productos usando flux-kontext-pro
    const productTransformationPrompts = [
      "Transform this into a professional studio product photo with clean white background and perfect commercial lighting",
      "Make this an elegant luxury product shot on marble surface with soft natural lighting and premium aesthetic",
      "Convert this to a modern lifestyle product photo in contemporary office setting with natural daylight",
      "Transform into premium e-commerce product photography with gradient background and studio lighting",
      "Make this a professional product photo in natural setting with warm ambient lighting and authentic context",
      "Convert to dramatic luxury product showcase with dark background and accent lighting",
      "Transform into bright, airy product photography with soft diffused lighting and clean white background",
      "Make this an artisanal product photo on wooden surface with natural textures and warm lighting",
      "Convert to sleek modern product display with geometric background and contemporary design",
      "Transform into elegant product photography with subtle reflections and premium studio setup"
    ];

    const mockups = [];
    const errors = [];

    console.log(`Starting generation of ${productTransformationPrompts.length} mockups`)

    // Generar cada mockup usando flux-kontext-pro con manejo individual de errores
    for (let i = 0; i < productTransformationPrompts.length; i++) {
      try {
        console.log(`Generating mockup ${i + 1}/${productTransformationPrompts.length} with prompt: ${productTransformationPrompts[i]}`);
        
        const startTime = Date.now();
        const output = await replicate.run(
          "black-forest-labs/flux-kontext-pro",
          {
            input: {
              prompt: productTransformationPrompts[i],
              input_image: imageUrl,
              aspect_ratio: "1:1"
            }
          }
        );
        const duration = Date.now() - startTime;

        if (output && typeof output === 'string') {
          // Validar que la salida sea una URL válida
          try {
            new URL(output);
            mockups.push(output);
            console.log(`Successfully generated mockup ${i + 1} in ${duration}ms`);
          } catch {
            console.error(`Invalid URL output for mockup ${i + 1}:`, output);
            errors.push(`Mockup ${i + 1}: Invalid URL format`);
          }
        } else {
          console.error(`Invalid output format for mockup ${i + 1}:`, output);
          errors.push(`Mockup ${i + 1}: Invalid output format`);
        }
      } catch (error) {
        console.error(`Error generating mockup ${i + 1}:`, error);
        errors.push(`Mockup ${i + 1}: ${error.message || 'Unknown error'}`);
        // Continuar con el siguiente mockup si uno falla
      }
    }

    console.log(`Generation completed. Success: ${mockups.length}, Errors: ${errors.length}`);
    
    // Si no se generó ningún mockup, devolver error
    if (mockups.length === 0) {
      console.error('No mockups were generated successfully. Errors:', errors);
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
      ...(errors.length > 0 && { warnings: errors })
    };

    console.log(`Returning ${mockups.length} successful mockups`);
    
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
