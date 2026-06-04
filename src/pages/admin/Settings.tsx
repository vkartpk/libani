import { useEffect, useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, ShieldOff, Pencil } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function AdminSettings() {
  return (
    <AdminLayout title="Settings">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="delivery">Delivery & Currency</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="business"><BusinessTab /></TabsContent>
        <TabsContent value="delivery"><DeliveryTab /></TabsContent>
        <TabsContent value="offers"><OffersTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}

/* ---------- Users & Roles ---------- */
function UsersTab() {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data, error } = await supabase.rpc("admin_list_customers");
    if (error) toast.error(error.message);
    setList(data || []);
  };
  useEffect(() => { load(); }, []);

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin removed");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Admin granted");
    }
    load();
  };

  const filtered = list.filter((c) => !search || (c.name || "").toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search));

  return (
    <Card className="p-4 mt-4">
      <div className="flex gap-2 mb-3">
        <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <div className="ml-auto text-sm text-muted-foreground self-center">{filtered.length} users</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="py-2">Name</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.user_id} className="border-t">
                <td className="py-2">{c.name || <span className="text-muted-foreground">—</span>}</td>
                <td>{c.phone || "—"}</td>
                <td>{c.order_count}</td>
                <td>Rs {Number(c.total_spent).toLocaleString()}</td>
                <td>
                  <span className={`text-xs font-semibold ${c.is_admin ? "text-primary" : "text-muted-foreground"}`}>
                    {c.is_admin ? "ADMIN" : "CUSTOMER"}
                  </span>
                </td>
                <td>
                  <Button size="sm" variant={c.is_admin ? "outline" : "default"} onClick={() => toggleAdmin(c.user_id, c.is_admin)}>
                    {c.is_admin ? (<><ShieldOff className="h-3 w-3 mr-1" /> Revoke admin</>) : (<><ShieldCheck className="h-3 w-3 mr-1" /> Make admin</>)}
                  </Button>
                </td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No users</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ---------- Settings form helpers ---------- */
function useSettingsForm() {
  const { settings, refetch } = useSiteSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(settings);
  useEffect(() => { setForm(settings); }, [settings.id]);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const save = async (fields: string[]) => {
    const payload: any = {};
    fields.forEach((k) => (payload[k] = form[k]));
    let res;
    if (form.id) {
      res = await supabase.from("site_settings").update(payload).eq("id", form.id);
    } else {
      res = await supabase.from("site_settings").insert({ ...payload, singleton: true });
    }
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    refetch();
  };
  return { form, set, save };
}

/* ---------- Business ---------- */
function BusinessTab() {
  const { form, set, save } = useSettingsForm();
  const social = form.social || {};
  const setSocial = (k: string, v: string) => set("social", { ...social, [k]: v });
  return (
    <Card className="p-6 mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Site name"><Input value={form.site_name || ""} onChange={(e) => set("site_name", e.target.value)} /></Field>
        <Field label="Tagline"><Input value={form.tagline || ""} onChange={(e) => set("tagline", e.target.value)} /></Field>
        <Field label="Support phone"><Input value={form.support_phone || ""} onChange={(e) => set("support_phone", e.target.value)} /></Field>
        <Field label="Support email"><Input value={form.support_email || ""} onChange={(e) => set("support_email", e.target.value)} /></Field>
        <Field label="WhatsApp number"><Input value={form.whatsapp || ""} onChange={(e) => set("whatsapp", e.target.value)} /></Field>
        <Field label="Logo URL"><Input value={form.logo_url || ""} onChange={(e) => set("logo_url", e.target.value)} /></Field>
      </div>
      <Field label="Address"><Textarea value={form.address || ""} onChange={(e) => set("address", e.target.value)} /></Field>
      <div className="pt-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Social links</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {["facebook","instagram","tiktok","youtube","twitter","linkedin"].map((k) => (
            <Field key={k} label={k}><Input value={social[k] || ""} onChange={(e) => setSocial(k, e.target.value)} placeholder={`https://${k}.com/...`} /></Field>
          ))}
        </div>
      </div>
      <Button onClick={() => save(["site_name","tagline","support_phone","support_email","whatsapp","address","social","logo_url"])}>Save business info</Button>
    </Card>
  );
}

/* ---------- Delivery & Currency ---------- */
function DeliveryTab() {
  const { form, set, save } = useSettingsForm();
  return (
    <Card className="p-6 mt-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Currency</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Code (PKR, USD…)"><Input value={form.currency_code || ""} onChange={(e) => set("currency_code", e.target.value.toUpperCase())} /></Field>
          <Field label="Symbol"><Input value={form.currency_symbol || ""} onChange={(e) => set("currency_symbol", e.target.value)} /></Field>
          <Field label="Locale"><Input value={form.currency_locale || ""} onChange={(e) => set("currency_locale", e.target.value)} placeholder="en-PK" /></Field>
          <Field label="Decimals"><Input type="number" min={0} max={4} value={form.currency_decimals ?? 0} onChange={(e) => set("currency_decimals", Number(e.target.value))} /></Field>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Delivery</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Shipping fee"><Input type="number" value={form.shipping_fee ?? 0} onChange={(e) => set("shipping_fee", Number(e.target.value))} /></Field>
          <Field label="Free shipping above"><Input type="number" value={form.free_shipping_threshold ?? 0} onChange={(e) => set("free_shipping_threshold", Number(e.target.value))} /></Field>
          <Field label="COD fee"><Input type="number" value={form.cod_fee ?? 0} onChange={(e) => set("cod_fee", Number(e.target.value))} /></Field>
          <Field label="Min delivery days"><Input type="number" value={form.delivery_days_min ?? 2} onChange={(e) => set("delivery_days_min", Number(e.target.value))} /></Field>
          <Field label="Max delivery days"><Input type="number" value={form.delivery_days_max ?? 5} onChange={(e) => set("delivery_days_max", Number(e.target.value))} /></Field>
        </div>
        <p className="text-xs text-muted-foreground mt-2">These values control the storefront cart, checkout summary, and shipping totals automatically.</p>
      </div>
      <Button onClick={() => save(["currency_code","currency_symbol","currency_locale","currency_decimals","shipping_fee","free_shipping_threshold","cod_fee","delivery_days_min","delivery_days_max"])}>Save delivery & currency</Button>
    </Card>
  );
}

/* ---------- Offers ---------- */
function OffersTab() {
  const { form, set, save } = useSettingsForm();
  const promo = form.promo || {};
  const setPromo = (k: string, v: any) => set("promo", { ...promo, [k]: v });
  return (
    <div className="space-y-4 mt-4">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Announcement bar</h3>
          <div className="flex items-center gap-2 text-sm">
            <Switch checked={!!form.announcement_enabled} onCheckedChange={(v) => set("announcement_enabled", v)} />
            <span>{form.announcement_enabled ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
        <Field label="Message"><Input value={form.announcement_text || ""} onChange={(e) => set("announcement_text", e.target.value)} placeholder="Free shipping above Rs.1000 • Authentic Products" /></Field>
        <Field label="Optional link"><Input value={form.announcement_link || ""} onChange={(e) => set("announcement_link", e.target.value)} placeholder="/products" /></Field>
        <Button onClick={() => save(["announcement_enabled","announcement_text","announcement_link"])}>Save announcement</Button>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Promo banner</h3>
          <div className="flex items-center gap-2 text-sm">
            <Switch checked={!!promo.enabled} onCheckedChange={(v) => setPromo("enabled", v)} />
            <span>{promo.enabled ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title"><Input value={promo.title || ""} onChange={(e) => setPromo("title", e.target.value)} /></Field>
          <Field label="Subtitle"><Input value={promo.subtitle || ""} onChange={(e) => setPromo("subtitle", e.target.value)} /></Field>
          <Field label="CTA label"><Input value={promo.cta || ""} onChange={(e) => setPromo("cta", e.target.value)} /></Field>
          <Field label="CTA link"><Input value={promo.href || ""} onChange={(e) => setPromo("href", e.target.value)} /></Field>
          <Field label="Image URL"><Input value={promo.image || ""} onChange={(e) => setPromo("image", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Starts"><Input type="datetime-local" value={promo.starts_at || ""} onChange={(e) => setPromo("starts_at", e.target.value)} /></Field>
            <Field label="Ends"><Input type="datetime-local" value={promo.ends_at || ""} onChange={(e) => setPromo("ends_at", e.target.value)} /></Field>
          </div>
        </div>
        <Button onClick={() => save(["promo"])}>Save promo</Button>
      </Card>

      <CouponsCard />
    </div>
  );
}

function CouponsCard() {
  const qc = useQueryClient();
  const { data: coupons = [], refetch } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const remove = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refetch();
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Coupons</h3>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> New coupon</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th className="py-2">Code</th><th>Type</th><th>Value</th><th>Min</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {coupons.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="py-2 font-mono font-semibold">{c.code}</td>
                <td>{c.type}</td>
                <td>{c.type === "percent" ? `${c.value}%` : c.type === "free_shipping" ? "—" : `Rs ${c.value}`}</td>
                <td>{c.min_subtotal ? `Rs ${c.min_subtotal}` : "—"}</td>
                <td>{c.active ? <span className="text-success text-xs">YES</span> : <span className="text-muted-foreground text-xs">NO</span>}</td>
                <td className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-3 w-3" /></Button>
                </td>
              </tr>
            ))}
            {!coupons.length && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">No coupons yet</td></tr>}
          </tbody>
        </table>
      </div>
      <CouponDialog open={open} onOpenChange={setOpen} initial={editing} onSaved={() => { refetch(); qc.invalidateQueries({ queryKey: ["coupons"] }); }} />
    </Card>
  );
}

function CouponDialog({ open, onOpenChange, initial, onSaved }: any) {
  const [f, setF] = useState<any>({});
  useEffect(() => {
    setF(initial || { code: "", type: "percent", value: 10, min_subtotal: 0, max_discount: null, active: true });
  }, [initial, open]);
  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const save = async () => {
    if (!f.code) return toast.error("Code required");
    const payload: any = {
      code: f.code.trim().toUpperCase(),
      type: f.type,
      value: Number(f.value || 0),
      min_subtotal: Number(f.min_subtotal || 0),
      max_discount: f.max_discount ? Number(f.max_discount) : null,
      active: !!f.active,
      starts_at: f.starts_at || null,
      ends_at: f.ends_at || null,
      usage_limit: f.usage_limit ? Number(f.usage_limit) : null,
    };
    const res = initial?.id
      ? await supabase.from("coupons").update(payload).eq("id", initial.id)
      : await supabase.from("coupons").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    onSaved();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{initial?.id ? "Edit coupon" : "New coupon"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Code"><Input value={f.code || ""} onChange={(e) => set("code", e.target.value)} /></Field>
          <Field label="Type">
            <Select value={f.type} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percent off</SelectItem>
                <SelectItem value="fixed">Fixed amount</SelectItem>
                <SelectItem value="free_shipping">Free shipping</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {f.type !== "free_shipping" && (
            <Field label={f.type === "percent" ? "Percent" : "Amount"}><Input type="number" value={f.value ?? 0} onChange={(e) => set("value", e.target.value)} /></Field>
          )}
          <Field label="Min subtotal"><Input type="number" value={f.min_subtotal ?? 0} onChange={(e) => set("min_subtotal", e.target.value)} /></Field>
          {f.type === "percent" && (
            <Field label="Max discount (optional)"><Input type="number" value={f.max_discount ?? ""} onChange={(e) => set("max_discount", e.target.value)} /></Field>
          )}
          <Field label="Usage limit (optional)"><Input type="number" value={f.usage_limit ?? ""} onChange={(e) => set("usage_limit", e.target.value)} /></Field>
          <Field label="Starts at"><Input type="datetime-local" value={f.starts_at?.slice(0,16) || ""} onChange={(e) => set("starts_at", e.target.value)} /></Field>
          <Field label="Ends at"><Input type="datetime-local" value={f.ends_at?.slice(0,16) || ""} onChange={(e) => set("ends_at", e.target.value)} /></Field>
          <div className="col-span-2 flex items-center gap-2">
            <Switch checked={!!f.active} onCheckedChange={(v) => set("active", v)} /> <span className="text-sm">Active</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- shared ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs capitalize text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}