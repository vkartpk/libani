import { useEffect, useState } from "react";
import { AccountLayout } from "./AccountLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty = { label: "Home", full_name: "", phone: "", line1: "", line2: "", city: "", province: "", postal_code: "", is_default: false };

export default function Addresses() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState(empty);

  const load = () => supabase.from("addresses").select("*").order("created_at", { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("addresses").insert({ ...form, user_id: user.id });
    if (error) toast.error(error.message); else { toast.success("Address saved"); setForm(empty); load(); }
  };

  const remove = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    load();
  };

  return (
    <AccountLayout>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display font-bold mb-3">Saved addresses</h2>
          {list.length === 0 ? <p className="text-sm text-muted-foreground">No addresses saved.</p> : (
            <ul className="space-y-2">
              {list.map((a) => (
                <li key={a.id} className="bg-card border border-border rounded p-3 flex justify-between gap-3">
                  <div className="text-sm"><p className="font-medium">{a.label} — {a.full_name}</p><p className="text-muted-foreground text-xs">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.province} {a.postal_code}</p><p className="text-muted-foreground text-xs">{a.phone}</p></div>
                  <button onClick={() => remove(a.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form onSubmit={save} className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-display font-bold">Add new address</h2>
          {(["label","full_name","phone","line1","line2","city","province","postal_code"] as const).map((k) => (
            <div key={k}><Label className="capitalize">{k.replace("_"," ")}</Label><Input value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={k !== "line2"} /></div>
          ))}
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Save address</Button>
        </form>
      </div>
    </AccountLayout>
  );
}