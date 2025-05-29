
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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
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

    console.log("Generating professional product mockups for image:", imageUrl)

    // Prompts profesionales específicos para transformar productos simples en fotos impactantes
    const productTransformationPrompts = [
      "Transform this product into a professional studio photography shot with clean white background, perfect lighting, commercial quality, high-end product photography style",
      "Convert this item into an elegant luxury product photo on marble surface, soft natural lighting, premium commercial photography, minimalist aesthetic",
      "Transform into a modern lifestyle product shot, contemporary office desk setting, natural daylight, professional depth of field, clean composition",
      "Create a premium e-commerce product photo with gradient background, studio lighting, floating effect, commercial advertising quality",
      "Convert to professional product photography in natural setting, warm ambient lighting, authentic lifestyle context, high-end commercial style",
      "Transform into dramatic luxury product showcase, dark background with accent lighting, premium commercial photography, high contrast style",
      "Create bright, airy product photography, soft diffused lighting, clean white background, e-commerce ready, professional quality",
      "Convert to artisanal product photo on wooden surface, natural textures, warm lighting, craft photography style, professional composition",
      "Transform into sleek modern product display, geometric background elements, contemporary design, studio lighting, commercial quality",
      "Create elegant product photography with subtle reflections, premium studio setup, high-end commercial style, luxury brand aesthetic"
    ];

    const mockups = [];

    // Generar cada mockup usando GPT-Image-1 para transformación de productos
    for (let i = 0; i < productTransformationPrompts.length; i++) {
      try {
        console.log(`Generating mockup ${i + 1} with prompt: ${productTransformationPrompts[i]}`);
        
        const output = await replicate.run(
          "openai/gpt-image-1",
          {
            input: {
              prompt: productTransformationPrompts[i],
              input_images: [imageUrl],
              openai_api_key: OPENAI_API_KEY
            }
          }
        );

        if (output && output[0]) {
          mockups.push(output[0]);
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
