
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

    // Prompts para diferentes tipos de mockups
    const mockupPrompts = [
      `Professional product photography of the item, clean white background, studio lighting, commercial quality, 4k resolution, ${style} style`,
      `Elegant product mockup on a marble surface, soft natural lighting, minimalist composition, premium feel`,
      `Product placed on a wooden desk in a modern office setting, professional photography, depth of field`,
      `Clean product shot with subtle shadows, gradient background, commercial photography style`,
      `Product displayed in a lifestyle setting, natural environment, professional composition`,
      `Minimalist product photography, floating effect, clean background, studio quality`,
      `Product on a dark surface with dramatic lighting, premium commercial style`,
      `Bright and airy product shot, white background, soft shadows, e-commerce ready`,
      `Product mockup with geometric shapes in background, modern design, professional lighting`,
      `Elegant product display with subtle reflections, commercial photography, high-end feel`
    ];

    const mockups = [];

    // Generar cada mockup
    for (let i = 0; i < mockupPrompts.length; i++) {
      try {
        const output = await replicate.run(
          "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
          {
            input: {
              prompt: mockupPrompts[i],
              image: imageUrl,
              width: 512,
              height: 512,
              num_outputs: 1,
              guidance_scale: 7.5,
              num_inference_steps: 50,
              strength: 0.7
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
