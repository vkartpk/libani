import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Product = any;

export default function AdminProducts() {
  const [list, setList] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  const load = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(500);
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const filtered = list.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand_slug.includes(search.toLowerCase())
  );

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <AdminLayout title="Products">
      <Card className="p-4">
        <div className="flex gap-2 mb-3">
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Button onClick={() => setEditing({})}><Plus className="h-4 w-4 mr-1" /> New</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Flags</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 max-w-xs truncate">{p.name}</td>
                  <td>{p.brand_slug}</td>
                  <td>{p.category_slug}</td>
                  <td>Rs {Number(p.price).toLocaleString()}</td>
                  <td>{p.in_stock ? p.stock_count : <span className="text-destructive">Out</span>}</td>
                  <td className="text-xs">
                    {p.is_featured && <span className="bg-primary/10 text-primary px-1 rounded mr-1">Featured</span>}
                    {p.is_on_sale && <span className="bg-orange-500/10 text-orange-600 px-1 rounded mr-1">Sale</span>}
                    {p.is_new_arrival && <span className="bg-green-500/10 text-green-600 px-1 rounded">New</span>}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No products</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <ProductDialog editing={editing} onClose={() => setEditing(null)} onSaved={() => { load(); setEditing(null); }} />
    </AdminLayout>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ProductDialog({ editing, onClose, onSaved }: { editing: Product | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({});
  useEffect(() => {
    setForm(editing || {});
  }, [editing]);

  if (!editing) return null;
  const isNew = !editing.id;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name || ""),
      brand_slug: form.brand_slug,
      category_slug: form.category_slug,
      price: Number(form.price || 0),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      description: form.description || null,
      in_stock: form.in_stock ?? true,
      stock_count: Number(form.stock_count ?? 25),
      is_featured: !!form.is_featured,
      is_new_arrival: !!form.is_new_arrival,
      is_on_sale: !!form.is_on_sale,
      images: form.images_text ? form.images_text.split("\n").map((s: string) => s.trim()).filter(Boolean) : (form.images || []),
    };
    if (!payload.name || !payload.brand_slug || !payload.category_slug || !payload.price) {
      return toast.error("Name, brand, category and price are required");
    }
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Product created" : "Product updated");
    onSaved();
  };

  return (
    <Dialog open={!!editing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isNew ? "New product" : "Edit product"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Brand slug</Label><Input value={form.brand_slug || ""} onChange={(e) => set("brand_slug", e.target.value)} /></div>
            <div><Label>Category slug</Label><Input value={form.category_slug || ""} onChange={(e) => set("category_slug", e.target.value)} /></div>
            <div><Label>Price (Rs)</Label><Input type="number" value={form.price || ""} onChange={(e) => set("price", e.target.value)} /></div>
            <div><Label>Compare-at price</Label><Input type="number" value={form.compare_at_price || ""} onChange={(e) => set("compare_at_price", e.target.value)} /></div>
            <div><Label>Stock count</Label><Input type="number" value={form.stock_count ?? 25} onChange={(e) => set("stock_count", e.target.value)} /></div>
            <div className="flex items-center gap-2 mt-6"><Switch checked={form.in_stock ?? true} onCheckedChange={(v) => set("in_stock", v)} /><Label>In stock</Label></div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>
          <div>
            <Label>Image URLs (one per line)</Label>
            <Textarea value={form.images_text ?? (form.images || []).join("\n")} onChange={(e) => set("images_text", e.target.value)} rows={3} />
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2"><Switch checked={!!form.is_featured} onCheckedChange={(v) => set("is_featured", v)} /><Label>Featured</Label></div>
            <div className="flex items-center gap-2"><Switch checked={!!form.is_on_sale} onCheckedChange={(v) => set("is_on_sale", v)} /><Label>On sale</Label></div>
            <div className="flex items-center gap-2"><Switch checked={!!form.is_new_arrival} onCheckedChange={(v) => set("is_new_arrival", v)} /><Label>New arrival</Label></div>
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
