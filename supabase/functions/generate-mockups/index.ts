
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
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const body = await req.json()
    const { imageUrl, style = "professional" } = body

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: imageUrl is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log("Generating professional product mockups using flux-kontext-pro for image:", imageUrl)

    // Prompts específicos para transformar productos usando flux-kontext-pro
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

    // Generar cada mockup usando flux-kontext-pro
    for (let i = 0; i < productTransformationPrompts.length; i++) {
      try {
        console.log(`Generating mockup ${i + 1} with prompt: ${productTransformationPrompts[i]}`);
        
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

        if (output) {
          mockups.push(output);
          console.log(`Successfully generated mockup ${i + 1}`);
        }
      } catch (error) {
        console.error(`Error generating mockup ${i + 1}:`, error);
        // Continuar con el siguiente mockup si uno falla
      }
    }

    console.log(`Generated ${mockups.length} professional product mockups successfully`);
    
    return new Response(JSON.stringify({ mockups }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("Error in generate-mockups function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
