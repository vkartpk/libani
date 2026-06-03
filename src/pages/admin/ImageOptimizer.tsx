import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Image as ImageIcon, AlertCircle, Sparkles, Zap, RefreshCw, CheckCircle2 } from "lucide-react";

const BUCKET = "product-images";
const AUTO_KEY = "img-optimizer-auto-on-upload";

type Product = { id: string; name: string; slug: string; images: string[]; image_alts: string[] };

async function compressImage(blob: Blob, maxSize = 1600, quality = 0.82): Promise<Blob> {
  const bmp = await createImageBitmap(blob);
  const scale = Math.min(1, maxSize / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bmp, 0, 0, w, h);
  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/webp", quality));
}

function extractStoragePath(url: string): string | null {
  const m = url.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function useProducts() {
  return useQuery({
    queryKey: ["optimizer-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, images, image_alts")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

function BulkCompress() {
  const { data: products, isLoading, refetch } = useProducts();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ done: 0, savedBytes: 0, skipped: 0, failed: 0 });

  const allImages = useMemo(() => {
    const list: { product: Product; url: string; idx: number; path: string }[] = [];
    (products ?? []).forEach((p) => p.images?.forEach((u, idx) => {
      const path = extractStoragePath(u);
      if (path) list.push({ product: p, url: u, idx, path });
    }));
    return list;
  }, [products]);

  const run = async () => {
    if (!allImages.length) return;
    setRunning(true); setProgress(0);
    const s = { done: 0, savedBytes: 0, skipped: 0, failed: 0 };
    for (let i = 0; i < allImages.length; i++) {
      const { product, url, idx, path } = allImages[i];
      try {
        const res = await fetch(url);
        if (!res.ok) { s.failed++; continue; }
        const orig = await res.blob();
        if (orig.size < 80 * 1024) { s.skipped++; continue; }
        const compressed = await compressImage(orig);
        if (compressed.size >= orig.size * 0.95) { s.skipped++; continue; }
        const newPath = path.replace(/\.[a-z0-9]+$/i, "") + "-opt.webp";
        const { error: upErr } = await supabase.storage.from(BUCKET).upload(newPath, compressed, { upsert: true, contentType: "image/webp", cacheControl: "31536000" });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
        const newImages = [...product.images]; newImages[idx] = data.publicUrl;
        const { error: updErr } = await supabase.from("products").update({ images: newImages }).eq("id", product.id);
        if (updErr) throw updErr;
        product.images = newImages;
        s.savedBytes += orig.size - compressed.size; s.done++;
        await supabase.from("image_optimization_log").insert({ product_id: product.id, image_url: data.publicUrl, action: "compress", original_size: orig.size, new_size: compressed.size, status: "success" });
      } catch (e: any) {
        s.failed++;
        await supabase.from("image_optimization_log").insert({ product_id: product.id, image_url: url, action: "compress", status: "failed", notes: e.message });
      }
      setStats({ ...s });
      setProgress(Math.round(((i + 1) / allImages.length) * 100));
    }
    setRunning(false);
    toast.success(`Done. Compressed ${s.done}, saved ${(s.savedBytes / 1024 / 1024).toFixed(2)} MB`);
    refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Bulk Compress Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Scans all product images stored in your library, recompresses them to optimized WebP (max 1600px, quality 82),
          uploads the optimized version, and updates the product. Skips images that are already small or would not shrink further.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total Images" value={isLoading ? "…" : String(allImages.length)} />
          <Stat label="Compressed" value={String(stats.done)} />
          <Stat label="Skipped" value={String(stats.skipped)} />
          <Stat label="Saved" value={`${(stats.savedBytes / 1024 / 1024).toFixed(2)} MB`} />
        </div>
        {running && <Progress value={progress} />}
        <Button onClick={run} disabled={running || !allImages.length}>
          {running ? `Compressing… ${progress}%` : `Compress ${allImages.length} images`}
        </Button>
      </CardContent>
    </Card>
  );
}

function AutoOptimize() {
  const [on, setOn] = useState(() => localStorage.getItem(AUTO_KEY) !== "false");
  const toggle = (v: boolean) => { setOn(v); localStorage.setItem(AUTO_KEY, String(v)); toast.success(v ? "Auto-optimize enabled" : "Auto-optimize disabled"); };
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Auto-Optimize on Upload</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <div className="font-medium text-sm">Compress new uploads automatically</div>
            <div className="text-xs text-muted-foreground">When enabled, images uploaded via the product editor are resized & converted to WebP before storage.</div>
          </div>
          <Switch checked={on} onCheckedChange={toggle} />
        </div>
        <div className="text-xs text-muted-foreground">Settings: max 1600px on longest side, quality 82, format WebP.</div>
      </CardContent>
    </Card>
  );
}

function AltText() {
  const { data: products, isLoading, refetch } = useProducts();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const missing = useMemo(() => {
    const out: { product: Product; idx: number; url: string }[] = [];
    (products ?? []).forEach((p) => {
      p.images?.forEach((u, idx) => {
        const alt = p.image_alts?.[idx];
        if (!alt || !alt.trim()) out.push({ product: p, idx, url: u });
      });
    });
    return out;
  }, [products]);

  const run = async () => {
    if (!missing.length) return;
    setRunning(true); setProgress(0);
    let done = 0; let failed = 0;
    for (let i = 0; i < missing.length; i++) {
      const { product, idx, url } = missing[i];
      try {
        const { data, error } = await supabase.functions.invoke("generate-alt-text", {
          body: { imageUrl: url, productName: product.name },
        });
        if (error) throw error;
        const alt = data?.alt as string;
        if (alt) {
          const next = [...(product.image_alts ?? [])];
          while (next.length < product.images.length) next.push("");
          next[idx] = alt;
          await supabase.from("products").update({ image_alts: next }).eq("id", product.id);
          product.image_alts = next;
          await supabase.from("image_optimization_log").insert({ product_id: product.id, image_url: url, action: "alt_text", alt_text: alt, status: "success" });
          done++;
        }
      } catch (e: any) {
        failed++;
        await supabase.from("image_optimization_log").insert({ product_id: product.id, image_url: url, action: "alt_text", status: "failed", notes: e.message });
      }
      setProgress(Math.round(((i + 1) / missing.length) * 100));
    }
    setRunning(false);
    toast.success(`Generated ${done} alt texts${failed ? `, ${failed} failed` : ""}`);
    refetch();
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Alt Text Generator</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Uses Lovable AI (Gemini 2.5 Flash vision) to write SEO-friendly alt text for product images that don't have one yet.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat label="Missing alt text" value={isLoading ? "…" : String(missing.length)} />
          <Stat label="Total products" value={String(products?.length ?? 0)} />
        </div>
        {running && <Progress value={progress} />}
        <Button onClick={run} disabled={running || !missing.length}>
          {running ? `Generating… ${progress}%` : `Generate ${missing.length} alt texts`}
        </Button>
      </CardContent>
    </Card>
  );
}

function BrokenScanner() {
  const { data: products, isLoading } = useProducts();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ product: Product; url: string; idx: number; reason: string }[]>([]);
  const [scanned, setScanned] = useState(false);

  const allImages = useMemo(() => {
    const list: { product: Product; url: string; idx: number }[] = [];
    (products ?? []).forEach((p) => {
      if (!p.images?.length) list.push({ product: p, url: "", idx: -1 });
      else p.images.forEach((u, idx) => list.push({ product: p, url: u, idx }));
    });
    return list;
  }, [products]);

  const scan = async () => {
    setScanning(true); setProgress(0); setResults([]);
    const broken: typeof results = [];
    for (let i = 0; i < allImages.length; i++) {
      const { product, url, idx } = allImages[i];
      if (!url) broken.push({ product, url: "", idx: -1, reason: "No images" });
      else {
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (!res.ok) broken.push({ product, url, idx, reason: `HTTP ${res.status}` });
        } catch {
          broken.push({ product, url, idx, reason: "Fetch failed" });
        }
      }
      setProgress(Math.round(((i + 1) / allImages.length) * 100));
    }
    setResults(broken); setScanned(true); setScanning(false);
    toast.success(`Scan complete. ${broken.length} issues found.`);
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-primary" /> Broken / Missing Image Scanner</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Checks every product image URL with a HEAD request to find broken links and products missing images.</p>
        <div className="flex items-center gap-3">
          <Button onClick={scan} disabled={scanning || isLoading}>
            {scanning ? `Scanning… ${progress}%` : <><RefreshCw className="h-4 w-4 mr-2" /> Scan {allImages.length} images</>}
          </Button>
          {scanned && !scanning && (
            results.length === 0
              ? <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> All clear</span>
              : <Badge variant="destructive">{results.length} issues</Badge>
          )}
        </div>
        {scanning && <Progress value={progress} />}
        {results.length > 0 && (
          <div className="border rounded-md divide-y max-h-96 overflow-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 text-sm">
                <div className="h-10 w-10 rounded bg-muted grid place-items-center text-muted-foreground">
                  {r.url ? <img src={r.url} alt="" className="h-full w-full object-cover rounded" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} /> : <ImageIcon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.product.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.url || "—"}</div>
                </div>
                <Badge variant="destructive">{r.reason}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

export default function AdminImageOptimizer() {
  const { isLoading } = useProducts();
  return (
    <AdminLayout title="Image Optimizer">
      {isLoading ? <Skeleton className="h-96 w-full" /> : (
        <Tabs defaultValue="compress" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compress">Bulk Compress</TabsTrigger>
            <TabsTrigger value="auto">Auto-Optimize</TabsTrigger>
            <TabsTrigger value="alt">AI Alt Text</TabsTrigger>
            <TabsTrigger value="scan">Broken Scanner</TabsTrigger>
          </TabsList>
          <TabsContent value="compress"><BulkCompress /></TabsContent>
          <TabsContent value="auto"><AutoOptimize /></TabsContent>
          <TabsContent value="alt"><AltText /></TabsContent>
          <TabsContent value="scan"><BrokenScanner /></TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
}