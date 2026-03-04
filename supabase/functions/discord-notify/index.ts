import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, type, data } = await req.json();

    // Get webhook URL from vault
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: secrets } = await supabase.rpc("vault_read_secret", { secret_name: "DISCORD_WEBHOOK_URL" });
    
    let webhookUrl: string | undefined;
    if (secrets && secrets.length > 0) {
      webhookUrl = secrets[0].secret;
    }

    if (!webhookUrl) {
      // Fallback: try env
      webhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
    }

    if (!webhookUrl) {
      throw new Error("Discord webhook URL not configured");
    }

    let title = "";
    let description = "";
    let color = 0x00ff00; // green

    if (type === "order") {
      if (action === "added") {
        title = "📦 New Order Added";
        description = `**Customer:** ${data.customerId}\n**Server:** ${data.serverType}\n**Qty:** ${data.quantity}\n**Price:** $${data.price}\n**Plan:** ${data.plan}\n**Period:** ${data.months}`;
        color = 0x22c55e;
      } else if (action === "updated") {
        title = "✏️ Order Updated";
        description = `**Customer:** ${data.customerId}\n**Price:** $${data.price}`;
        color = 0x3b82f6;
      } else if (action === "deleted") {
        title = "🗑️ Order Deleted";
        description = `**Customer:** ${data.customerId}\n**Price:** $${data.price}`;
        color = 0xef4444;
      }
    } else if (type === "expense") {
      if (action === "added") {
        title = "💸 New Expense Added";
        description = `**Description:** ${data.description}\n**Amount:** $${data.amount}\n**Date:** ${data.date}`;
        color = 0xf59e0b;
      } else if (action === "updated") {
        title = "✏️ Expense Updated";
        description = `**Description:** ${data.description}\n**Amount:** $${data.amount}`;
        color = 0x3b82f6;
      } else if (action === "deleted") {
        title = "🗑️ Expense Deleted";
        description = `**Description:** ${data.description}\n**Amount:** $${data.amount}`;
        color = 0xef4444;
      }
    }

    const embed = {
      title,
      description,
      color,
      timestamp: new Date().toISOString(),
      footer: { text: "Vortexacloud Revenue Tracker" },
    };

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      throw new Error(`Discord API error [${discordRes.status}]: ${errText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Discord notify error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
