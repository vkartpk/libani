import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SingleImageUploader } from "@/components/libani/ImageUploader";

export default function AdminBrands() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const { data } = await supabase.from("brands").select("*").order("name");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (slug: string) => {
    if (!confirm("Delete this brand?")) return;
    const { error } = await supabase.from("brands").delete().eq("slug", slug);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <AdminLayout title="Brands">
      <Card className="p-4">
        <div className="flex justify-between mb-3">
          <div className="text-sm text-muted-foreground">{list.length} brands</div>
          <Button onClick={() => setEditing({})}><Plus className="h-4 w-4 mr-1" /> New</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr><th className="py-2">Logo</th><th>Name</th><th>Slug</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.slug} className="border-t">
                  <td className="py-2">{b.logo_url ? <img src={b.logo_url} alt={b.name} className="h-8 w-16 object-contain" /> : "—"}</td>
                  <td>{b.name}</td>
                  <td className="font-mono text-xs">{b.slug}</td>
                  <td>{b.is_active ? "Yes" : "No"}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(b.slug)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No brands</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <BrandDialog editing={editing} onClose={() => setEditing(null)} onSaved={() => { load(); setEditing(null); }} />
    </AdminLayout>
  );
}

function BrandDialog({ editing, onClose, onSaved }: { editing: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({});
  useEffect(() => { setForm(editing || {}); }, [editing]);
  if (!editing) return null;
  const isNew = !editing.slug;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description || null,
      logo_url: form.logo_url || null,
      banner_url: form.banner_url || null,
      is_active: form.is_active ?? true,
    };
    if (!payload.slug || !payload.name) return toast.error("Slug and name required");
    const { error } = isNew
      ? await supabase.from("brands").insert(payload)
      : await supabase.from("brands").update(payload).eq("slug", editing.slug);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onSaved();
  };

  return (
    <Dialog open={!!editing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{isNew ? "New brand" : "Edit brand"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></div>
          <div><Label>Slug</Label><Input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} disabled={!isNew} /></div>
          <div><Label>Description</Label><Textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={2} /></div>
          <div><Label>Logo</Label><SingleImageUploader value={form.logo_url} onChange={(u) => set("logo_url", u)} folder="brands" /></div>
          <div><Label>Banner</Label><SingleImageUploader value={form.banner_url} onChange={(u) => set("banner_url", u)} folder="brands" /></div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active ?? true} onCheckedChange={(v) => set("is_active", v)} /><Label>Active</Label></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}