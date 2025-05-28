
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

    console.log("Generating mockups for image:", imageUrl)

    // Prompts profesionales para diferentes estilos de mockups
    const mockupPrompts = [
      `Professional product photography, clean white background, studio lighting, high-end commercial style, minimalist composition, product centered, soft shadows`,
      `Elegant product mockup on marble surface, luxury feel, soft natural lighting, premium commercial photography, clean aesthetic`,
      `Modern office desk setup with product, professional workspace, natural daylight, contemporary style, depth of field`,
      `Clean minimalist product display, floating effect, gradient background, studio quality, commercial advertising style`,
      `Lifestyle product photography, natural environment, professional composition, warm lighting, authentic setting`,
      `Premium product showcase, dark background with dramatic lighting, luxury commercial style, high contrast`,
      `Bright airy product shot, white background, soft diffused lighting, e-commerce ready, clean and professional`,
      `Product on wooden surface, natural textures, warm lighting, artisanal feel, professional photography`,
      `Geometric modern background, contemporary design, professional lighting, commercial quality, sleek presentation`,
      `Elegant product display with subtle reflections, premium feel, studio lighting, high-end commercial photography`
    ];

    const mockups = [];

    // Generar cada mockup usando un modelo mejor para productos
    for (let i = 0; i < mockupPrompts.length; i++) {
      try {
        const output = await replicate.run(
          "black-forest-labs/flux-schnell",
          {
            input: {
              prompt: mockupPrompts[i],
              image: imageUrl,
              go_fast: true,
              megapixels: "1",
              num_outputs: 1,
              aspect_ratio: "1:1",
              output_format: "webp",
              output_quality: 90,
              num_inference_steps: 8,
              guidance_scale: 3.5
            }
          }
        );

        if (output && output[0]) {
          mockups.push(output[0]);
        }
      } catch (error) {
        console.error(`Error generating mockup ${i + 1}:`, error);
        // Continuar con el siguiente mockup si uno falla
      }
    }

    console.log(`Generated ${mockups.length} mockups successfully`);
    
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
