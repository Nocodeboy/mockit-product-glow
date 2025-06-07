
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

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const { priceId, planType } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    let sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/?canceled=true`,
    };

    if (planType === "subscription") {
      // For subscription plans
      const prices = {
        pro: { unit_amount: 1900, name: "Plan Pro" },
        enterprise: { unit_amount: 9900, name: "Plan Empresas" }
      };
      
      const selectedPrice = prices[priceId as keyof typeof prices];
      
      sessionConfig = {
        ...sessionConfig,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: selectedPrice.name },
              unit_amount: selectedPrice.unit_amount,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
      };
    } else {
      // For credit purchases
      const creditPackages = {
        credits_50: { amount: 499, credits: 50, name: "50 Créditos" },
        credits_100: { amount: 999, credits: 100, name: "100 Créditos" },
        credits_500: { amount: 3999, credits: 500, name: "500 Créditos" }
      };
      
      const selectedPackage = creditPackages[priceId as keyof typeof creditPackages];
      
      sessionConfig = {
        ...sessionConfig,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: selectedPackage.name,
                metadata: { credits: selectedPackage.credits.toString() }
              },
              unit_amount: selectedPackage.amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
