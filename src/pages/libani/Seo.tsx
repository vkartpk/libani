import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Loader2, RefreshCw, Pencil } from "lucide-react";
import { toast } from "sonner";

type Product = any;

export default function AdminSeo() {
  const [list, setList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "missing">("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("id,name,slug,brand_slug,category_slug,price,description,tags,meta_title,meta_description,seo_keywords,seo_faq,seo_updated_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => list.filter(p => {
    const matches = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const isMissing = !p.meta_title || !p.meta_description;
    return matches && (filter === "all" || isMissing);
  }), [list, search, filter]);

  const missingCount = list.filter(p => !p.meta_title || !p.meta_description).length;

  const generate = async (ids: string[]) => {
    const { data, error } = await supabase.functions.invoke("seo-generate", { body: { product_ids: ids } });
    if (error) {
      toast.error(error.message || "Failed to generate SEO");
      return false;
    }
    if ((data as any)?.error) {
      toast.error((data as any).error);
      return false;
    }
    return true;
  };

  const generateOne = async (p: Product) => {
    setBusy(p.id);
    const ok = await generate([p.id]);
    setBusy(null);
    if (ok) { toast.success("SEO generated ✨"); load(); }
  };

  const generateBulk = async () => {
    const targets = list.filter(p => !p.meta_title || !p.meta_description).map(p => p.id);
    if (!targets.length) return toast.info("All products already have SEO");
    if (!confirm(`Generate SEO for ${targets.length} products with AI? This uses AI credits.`)) return;
    setBulkProgress({ done: 0, total: targets.length });
    const BATCH = 3;
    for (let i = 0; i < targets.length; i += BATCH) {
      const slice = targets.slice(i, i + BATCH);
      await generate(slice);
      setBulkProgress({ done: Math.min(i + BATCH, targets.length), total: targets.length });
    }
    setBulkProgress(null);
    toast.success("Bulk SEO complete ✓");
    load();
  };

  return (
    <AdminLayout title="SEO / AEO / GEO">
      <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-transparent">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI-powered SEO</h2>
            <p className="text-sm text-muted-foreground">
              Generate Pakistan-localized meta titles, descriptions, keywords and FAQ schema (for ChatGPT / Google AI Overviews) — automatically.
            </p>
            <p className="text-xs mt-1">{missingCount} of {list.length} products missing SEO</p>
          </div>
          <Button onClick={generateBulk} disabled={!!bulkProgress || !missingCount}>
            {bulkProgress ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{bulkProgress.done}/{bulkProgress.total}</> : <><Sparkles className="h-4 w-4 mr-2" />Optimize all missing ({missingCount})</>}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <div className="flex gap-1">
            <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
            <Button size="sm" variant={filter === "missing" ? "default" : "outline"} onClick={() => setFilter("missing")}>Missing only</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Product</th><th>Meta title</th><th>Meta description</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.map(p => {
                const has = p.meta_title && p.meta_description;
                return (
                  <tr
                    key={p.id}
                    className="border-t align-top cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => setEditing(p)}
                  >
                    <td className="py-2 max-w-[200px] truncate font-medium hover:underline">{p.name}</td>
                    <td className="max-w-[260px] text-xs truncate text-muted-foreground">{p.meta_title || <span className="italic">— none —</span>}</td>
                    <td className="max-w-[320px] text-xs truncate text-muted-foreground">{p.meta_description || <span className="italic">— none —</span>}</td>
                    <td>
                      {has
                        ? <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">Optimized</Badge>
                        : <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">Missing</Badge>}
                    </td>
                    <td className="min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col md:flex-row gap-1 justify-end">
                        <Button size="sm" variant="default" onClick={() => setEditing(p)}>
                          <Pencil className="h-3 w-3" />
                          <span className="ml-1">Edit</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => generateOne(p)} disabled={busy === p.id}>
                          {busy === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          <span className="ml-1">{has ? "Regenerate" : "Generate"}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && !filtered.length && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No products</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <SeoEditDialog editing={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} onRegenerate={generateOne} />
    </AdminLayout>
  );
}

function SeoEditDialog({ editing, onClose, onSaved, onRegenerate }: { editing: Product | null; onClose: () => void; onSaved: () => void; onRegenerate: (p: Product) => Promise<void> }) {
  const [form, setForm] = useState<any>({});
  useEffect(() => { setForm(editing || {}); }, [editing]);
  if (!editing) return null;

  const save = async () => {
    const { error } = await supabase.from("products").update({
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      seo_keywords: form.seo_keywords || [],
      seo_faq: form.seo_faq || [],
      seo_updated_at: new Date().toISOString(),
    }).eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("SEO saved");
    onSaved();
  };

  const faq: { q: string; a: string }[] = Array.isArray(form.seo_faq) ? form.seo_faq : [];

  return (
    <Dialog open={!!editing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>SEO — {editing.name}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Button size="sm" variant="outline" onClick={() => onRegenerate(editing)}><RefreshCw className="h-3 w-3 mr-1" /> Regenerate with AI</Button>
          <div>
            <Label>Meta title <span className="text-xs text-muted-foreground">({(form.meta_title || "").length}/60)</span></Label>
            <Input value={form.meta_title || ""} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
          </div>
          <div>
            <Label>Meta description <span className="text-xs text-muted-foreground">({(form.meta_description || "").length}/160)</span></Label>
            <Textarea rows={3} value={form.meta_description || ""} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
          </div>
          <div>
            <Label>Keywords (comma-separated)</Label>
            <Input value={(form.seo_keywords || []).join(", ")} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} />
          </div>
          <div>
            <Label>FAQ (for AEO / Answer Engine Optimization)</Label>
            <div className="space-y-2 mt-1">
              {faq.map((f, i) => (
                <div key={i} className="border rounded p-2 space-y-1">
                  <Input placeholder="Question" value={f.q} onChange={(e) => { const n = [...faq]; n[i] = { ...n[i], q: e.target.value }; setForm({ ...form, seo_faq: n }); }} />
                  <Textarea placeholder="Answer" rows={2} value={f.a} onChange={(e) => { const n = [...faq]; n[i] = { ...n[i], a: e.target.value }; setForm({ ...form, seo_faq: n }); }} />
                  <Button size="sm" variant="ghost" onClick={() => setForm({ ...form, seo_faq: faq.filter((_, j) => j !== i) })}>Remove</Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={() => setForm({ ...form, seo_faq: [...faq, { q: "", a: "" }] })}>Add Q&A</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}