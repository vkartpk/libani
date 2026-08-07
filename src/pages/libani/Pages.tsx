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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const db = supabase as any;

export default function AdminPages() {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [tab, setTab] = useState<"policy" | "system">("policy");

  const load = async () => {
    const { data, error } = await db.from("pages").select("*").order("sort_order");
    if (error) return toast.error(error.message);
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    const { error } = await db.from("pages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <AdminLayout title="Pages">
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant={tab === "policy" ? "default" : "outline"} onClick={() => setTab("policy")}>Policy pages</Button>
        <Button size="sm" variant={tab === "system" ? "default" : "outline"} onClick={() => setTab("system")}>Existing site pages</Button>
      </div>
      {tab === "system" ? (
        <SystemPages list={list.filter((p) => p.kind === "system")} onEdit={setEditing} />
      ) : (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">{list.filter((p) => p.kind !== "system").length} pages · footer links update automatically</div>
          <Button onClick={() => setEditing({ show_in_footer: true, is_published: true, sort_order: (list.length + 1) * 10 })}>
            <Plus className="h-4 w-4 mr-1" /> New page
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr><th className="py-2">Title</th><th>URL</th><th>Footer</th><th>Published</th><th>Order</th><th></th></tr>
            </thead>
            <tbody>
              {list.filter((p) => p.kind !== "system").map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 font-medium">{p.title}</td>
                  <td className="font-mono text-xs">
                    <a href={`/policies/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                      /policies/{p.slug} <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td>{p.show_in_footer ? "Yes" : "No"}</td>
                  <td>{p.is_published ? "Yes" : "No"}</td>
                  <td>{p.sort_order}</td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.filter((p) => p.kind !== "system").length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No pages yet</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tip: inside content you can use <code>%shipping_fee%</code>, <code>%delivery_days%</code> and <code>%site_name%</code> — they are replaced with live settings values.
        </p>
      </Card>
      )}
      <PageDialog editing={editing} onClose={() => setEditing(null)} onSaved={() => { load(); setEditing(null); }} />
    </AdminLayout>
  );
}

function SystemPages({ list, onEdit }: { list: any[]; onEdit: (p: any) => void }) {
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground mb-3">
        These are the pages that already exist on your website (About, FAQ, Contact). You can edit their text, SEO and extras — the URL and layout stay fixed.
      </div>
      <div className="grid gap-3">
        {list.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="font-medium">{p.title}</div>
              <a href={p.route || `/${p.slug}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
                {p.route || `/${p.slug}`} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Button size="sm" variant="outline" onClick={() => onEdit(p)}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
          </div>
        ))}
        {!list.length && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Not set up yet — run <code>CMS_PAGES_V2.sql</code> in your database SQL editor to make About, FAQ and Contact editable.
          </p>
        )}
      </div>
    </Card>
  );
}

function PageDialog({ editing, onClose, onSaved }: { editing: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(editing || {}); }, [editing]);
  if (!editing) return null;
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.slug || !form.title) return toast.error("Title and URL slug are required");
    setSaving(true);
    const payload = {
      slug: String(form.slug).trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      title: form.title,
      content: form.content || "",
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      footer_label: form.footer_label || null,
      show_in_footer: !!form.show_in_footer,
      is_published: !!form.is_published,
      sort_order: Number(form.sort_order || 0),
    };
    const { error } = form.id
      ? await db.from("pages").update(payload).eq("id", form.id)
      : await db.from("pages").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit page" : "New page"}</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Title</Label><Input value={form.title || ""} onChange={(e) => set("title", e.target.value)} /></div>
            <div><Label>URL slug</Label><Input value={form.slug || ""} onChange={(e) => set("slug", e.target.value)} placeholder="privacy" /></div>
          </div>
          <div>
            <Label>Content</Label>
            <Textarea rows={10} value={form.content || ""} onChange={(e) => set("content", e.target.value)} placeholder="Page text… line breaks are preserved." />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div><Label>Footer link label</Label><Input value={form.footer_label || ""} onChange={(e) => set("footer_label", e.target.value)} placeholder="Same as title" /></div>
            <div><Label>Sort order</Label><Input type="number" value={form.sort_order ?? 0} onChange={(e) => set("sort_order", e.target.value)} /></div>
          </div>
          <div><Label>SEO title</Label><Input value={form.meta_title || ""} onChange={(e) => set("meta_title", e.target.value)} /></div>
          <div><Label>SEO description</Label><Textarea rows={2} value={form.meta_description || ""} onChange={(e) => set("meta_description", e.target.value)} /></div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.show_in_footer} onCheckedChange={(v) => set("show_in_footer", v)} /> Show in footer</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={!!form.is_published} onCheckedChange={(v) => set("is_published", v)} /> Published</label>
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
