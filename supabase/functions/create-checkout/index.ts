
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Create checkout function started");

    // Verificar que tenemos la clave de Stripe (probando ambas variantes)
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || Deno.env.get("STRIPE-SECRET-KEY");
    if (!stripeKey) {
      console.error("No se encontró STRIPE_SECRET_KEY ni STRIPE-SECRET-KEY");
      const availableEnvs = Object.keys(Deno.env.toObject()).filter(key => key.includes('STRIPE'));
      console.log("Variables disponibles que contienen STRIPE:", availableEnvs);
      throw new Error("STRIPE_SECRET_KEY no está configurada en los secretos");
    }
    console.log("Stripe key found:", stripeKey.substring(0, 10) + "...");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

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

    const { planType } = await req.json();
    console.log("Plan type requested:", planType);
    
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16" 
    });
    
    // Buscar cliente existente
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer found:", customerId);
    } else {
      console.log("No existing customer found");
    }

    // Configuración de precios para diferentes planes
    const priceConfig = {
      'free': { amount: 0, credits: 5 },
      'pro': { amount: 1999, credits: 100 }, // $19.99
      'enterprise': { amount: 9999, credits: 1000 } // $99.99
    };

    const config = priceConfig[planType as keyof typeof priceConfig] || priceConfig.pro;
    console.log("Price config:", config);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `Plan ${planType.charAt(0).toUpperCase() + planType.slice(1)} - MockIT`,
              description: `${config.credits} créditos mensuales`
            },
            unit_amount: config.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/dashboard?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        credits: config.credits.toString()
      }
    });

    console.log("Stripe session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error in create-checkout:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Error al procesar el pago. Verifica tu conexión y vuelve a intentar."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
