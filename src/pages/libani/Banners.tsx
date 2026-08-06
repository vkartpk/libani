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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SingleImageUploader } from "@/components/libani/ImageUploader";

const db = supabase as any;

export default function AdminBanners() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const load = async () => {
    const { data, error } = await db.from("banners").select("*").order("placement").order("sort_order");
    if (error) return toast.error(error.message);
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const { error } = await db.from("banners").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <AdminLayout title="Banners">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">{list.length} banners · hero slider &amp; gaming banner</div>
          <Button onClick={() => setEditing({ placement: "hero", is_active: true, sort_order: (list.length + 1) * 10 })}>
            <Plus className="h-4 w-4 mr-1" /> New banner
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Image</th><th>Title</th><th>Placement</th><th>Link</th><th>Active</th><th>Order</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="py-2">{b.image_url ? <img src={b.image_url} alt={b.title} className="h-10 w-20 object-cover rounded" /> : "—"}</td>
                  <td className="font-medium">{b.title}</td>
                  <td className="capitalize">{b.placement}</td>
                  <td className="font-mono text-xs">{b.cta_href || "—"}</td>
                  <td>{b.is_active ? "Yes" : "No"}</td>
                  <td>{b.sort_order}</td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(b)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No banners yet</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <BannerDialog editing={editing} onClose={() => setEditing(null)} onSaved={() => { load(); setEditing(null); }} />
    </AdminLayout>
  );
}

function BannerDialog({ editing, onClose, onSaved }: { editing: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(editing || {}); }, [editing]);
  if (!editing) return null;
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      placement: form.placement || "hero",
      title: form.title,
      subtitle: form.subtitle || null,
      badge: form.badge || null,
      cta_label: form.cta_label || null,
      cta_href: form.cta_href || null,
      image_url: form.image_url || null,
      sort_order: Number(form.sort_order || 0),
      is_active: !!form.is_active,
    };
    const { error } = form.id
      ? await db.from("banners").update(payload).eq("id", form.id)
      : await db.from("banners").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Placement</Label>
              <Select value={form.placement || "hero"} onValueChange={(v) => set("placement", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Home hero slider</SelectItem>
                  <SelectItem value="gaming">Gaming banner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Badge / eyebrow</Label><Input value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} /></div>
          </div>
          <div><Label>Title</Label><Input value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></div>
          <div><Label>Subtitle</Label><Textarea rows={2} value={form.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} /></div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Button label</Label><Input value={form.cta_label || ""} onChange={(e) => set("cta_label", e.target.value)} placeholder="Shop now" /></div>
            <div><Label>Button link</Label><Input value={form.cta_href || ""} onChange={(e) => set("cta_href", e.target.value)} placeholder="/category/tws" /></div>
          </div>
          <div>
            <Label>Banner image</Label>
            <SingleImageUploader value={form.image_url || ""} onChange={(url) => set("image_url", url)} folder="banners" />
          </div>
          <div className="grid md:grid-cols-2 gap-3 items-end">
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order ?? 0} onChange={(e) => set("sort_order", e.target.value)} /></div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.is_active} onCheckedChange={(v) => set("is_active", v)} /> Active</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
