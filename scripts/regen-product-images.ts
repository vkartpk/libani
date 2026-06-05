/**
 * One-off: regenerate a single AI image per product and update DB.
 * Run: bun scripts/regen-product-images.ts
 */
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SR = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AI = process.env.LOVABLE_API_KEY!;
const BUCKET = "product-images";

type P = { id: string; slug: string; name: string; brand_slug: string; category_slug: string };

const CATEGORY_HINTS: Record<string, string> = {
  routers: "wifi router with antennas",
  tws: "true wireless earbuds with charging case",
  headphones: "over-ear headphones",
  earphones: "wired earphones",
  mouse: "computer mouse",
  keyboard: "computer keyboard",
  speakers: "desktop speakers",
  webcam: "webcam",
  "power-banks": "portable power bank",
  chargers: "wall charger adapter",
  cables: "USB cable",
  "gaming-mouse": "gaming mouse with RGB lighting",
};

async function sb(path: string, init: RequestInit = {}) {
  const r = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SR,
      Authorization: `Bearer ${SR}`,
      ...(init.headers || {}),
    },
  });
  return r;
}

async function fetchProducts(): Promise<P[]> {
  const r = await sb(`/rest/v1/products?select=id,slug,name,brand_slug,category_slug&order=created_at`);
  if (!r.ok) throw new Error("fetch products: " + (await r.text()));
  return r.json();
}

async function genImage(prompt: string): Promise<Buffer> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${AI}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      prompt,
      size: "1024x1024",
      n: 1,
    }),
  });
  if (!r.ok) throw new Error(`AI ${r.status}: ${await r.text()}`);
  const j: any = await r.json();
  const b64 = j?.data?.[0]?.b64_json;
  if (!b64) throw new Error("no image: " + JSON.stringify(j).slice(0, 300));
  return Buffer.from(b64, "base64");
}

async function upload(path: string, buf: Buffer): Promise<string> {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SR}`,
      "Content-Type": "image/png",
      "x-upsert": "true",
    },
    body: buf,
  });
  if (!r.ok) throw new Error(`upload ${r.status}: ${await r.text()}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

async function updateRow(id: string, url: string, name: string) {
  const r = await sb(`/rest/v1/products?id=eq.${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ images: [url], image_alts: [name] }),
  });
  if (!r.ok) throw new Error(`update ${r.status}: ${await r.text()}`);
}

function buildPrompt(p: P) {
  const hint = CATEGORY_HINTS[p.category_slug] || p.category_slug;
  return `Professional studio e-commerce product photograph of "${p.name}" (a ${hint}). Single product centered on a clean light gray seamless gradient background, soft realistic shadow, neutral studio lighting, ultra-detailed, sharp focus, square 1:1 framing. No text, no logos, no watermarks, no human hands.`;
}

async function main() {
  const products = await fetchProducts();
  console.log(`Generating ${products.length} images...`);
  let ok = 0, fail = 0;
  for (const p of products) {
    try {
      const buf = await genImage(buildPrompt(p));
      const url = await upload(`regen/${p.slug}.png`, buf);
      await updateRow(p.id, url, p.name);
      ok++;
      console.log(`✓ [${ok + fail}/${products.length}] ${p.name}`);
    } catch (e: any) {
      fail++;
      console.error(`✗ ${p.name}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  console.log(`Done. ok=${ok} fail=${fail}`);
}

main().catch((e) => { console.error(e); process.exit(1); });