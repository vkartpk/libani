import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SingleImageUploader } from "@/components/admin/ImageUploader";

export default function AdminCategories() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order").order("name");
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (slug: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("slug", slug);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <AdminLayout title="Categories">
      <Card className="p-4">
        <div className="flex justify-between mb-3">
          <div className="text-sm text-muted-foreground">{list.length} categories</div>
          <Button onClick={() => setEditing({})}><Plus className="h-4 w-4 mr-1" /> New</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground"><tr><th className="py-2">Name</th><th>Slug</th><th>Group</th><th>Sort</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.slug} className="border-t">
                  <td className="py-2">{c.name}</td>
                  <td className="font-mono text-xs">{c.slug}</td>
                  <td>{c.group_name || "—"}</td>
                  <td>{c.sort_order}</td>
                  <td>{c.is_active ? "Yes" : "No"}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(c.slug)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No categories</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <CategoryDialog editing={editing} onClose={() => setEditing(null)} onSaved={() => { load(); setEditing(null); }} />
    </AdminLayout>
  );
}

function CategoryDialog({ editing, onClose, onSaved }: { editing: any; onClose: () => void; onSaved: () => void }) {
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
      image_url: form.image_url || null,
      group_name: form.group_name || null,
      sort_order: Number(form.sort_order ?? 0),
      is_active: form.is_active ?? true,
    };
    if (!payload.slug || !payload.name) return toast.error("Slug and name required");
    const { error } = isNew
      ? await supabase.from("categories").insert(payload)
      : await supabase.from("categories").update(payload).eq("slug", editing.slug);
    if (error) return toast.error(error.message);
    toast.success("Saved"); onSaved();
  };

  return (
    <Dialog open={!!editing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>{isNew ? "New category" : "Edit category"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Name</Label><Input value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></div>
          <div><Label>Slug</Label><Input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} disabled={!isNew} /></div>
          <div><Label>Group</Label><Input value={form.group_name || ""} onChange={(e) => set("group_name", e.target.value)} placeholder="main / peripherals / extra" /></div>
          <div><Label>Image</Label><SingleImageUploader value={form.image_url} onChange={(u) => set("image_url", u)} folder="categories" /></div>
          <div><Label>Sort order</Label><Input type="number" value={form.sort_order ?? 0} onChange={(e) => set("sort_order", e.target.value)} /></div>
          <div className="flex items-center gap-2"><Switch checked={form.is_active ?? true} onCheckedChange={(v) => set("is_active", v)} /><Label>Active</Label></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}