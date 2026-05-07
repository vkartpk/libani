import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You are an expert e-commerce SEO copywriter for vKart Pakistan, an online store serving customers across Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Quetta).
You optimize for traditional SEO (Google), AEO (Answer Engine Optimization for ChatGPT/Perplexity/Google AI Overviews), and GEO (local Pakistan signals).
Always include Pakistan / city / PKR / "Cash on Delivery" signals naturally where relevant.`;

const TOOL = {
  type: "function",
  function: {
    name: "write_seo",
    description: "Return optimized SEO metadata for a product",
    parameters: {
      type: "object",
      properties: {
        meta_title: { type: "string", description: "55-60 chars, includes brand + key benefit + Pakistan signal where natural" },
        meta_description: { type: "string", description: "140-160 chars, persuasive, includes price/availability/PKR/COD where relevant" },
        keywords: { type: "array", items: { type: "string" }, description: "8-15 keywords incl. local Pakistan terms" },
        faq: {
          type: "array",
          description: "3-5 Q&A pairs answering buyer questions for AEO",
          items: {
            type: "object",
            properties: { q: { type: "string" }, a: { type: "string" } },
            required: ["q", "a"],
            additionalProperties: false,
          },
        },
      },
      required: ["meta_title", "meta_description", "keywords", "faq"],
      additionalProperties: false,
    },
  },
};

async function generateOne(product: any): Promise<any> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  const prompt = `Product: ${product.name}
Brand: ${product.brand_slug}
Category: ${product.category_slug}
Price: PKR ${product.price}
Description: ${product.description || "(no description provided)"}
Tags: ${(product.tags || []).join(", ")}

Write SEO/AEO/GEO metadata. The FAQ should answer the top buyer questions (shipping, warranty, compatibility, COD, returns) tailored to Pakistan.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: prompt },
      ],
      tools: [TOOL],
      tool_choice: { type: "function", function: { name: "write_seo" } },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    const err: any = new Error(`AI gateway ${res.status}: ${txt}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error("No tool call in AI response");
  return JSON.parse(call.function.arguments);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: isAdminRes } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdminRes) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { product_ids } = await req.json();
    if (!Array.isArray(product_ids) || !product_ids.length) {
      return new Response(JSON.stringify({ error: "product_ids required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: products, error: pErr } = await supabase.from("products").select("*").in("id", product_ids);
    if (pErr) throw pErr;

    const results: any[] = [];
    for (const p of products || []) {
      try {
        const seo = await generateOne(p);
        const { error: uErr } = await supabase.from("products").update({
          meta_title: seo.meta_title,
          meta_description: seo.meta_description,
          seo_keywords: seo.keywords,
          seo_faq: seo.faq,
          seo_updated_at: new Date().toISOString(),
        }).eq("id", p.id);
        if (uErr) throw uErr;
        results.push({ id: p.id, ok: true });
      } catch (e: any) {
        if (e.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a minute." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (e.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        results.push({ id: p.id, ok: false, error: e.message });
      }
    }

    return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("seo-generate error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});