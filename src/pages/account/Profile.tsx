import { useEffect, useState } from "react";
import { AccountLayout } from "./AccountLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) { setName(data.name ?? ""); setPhone(data.phone ?? ""); setAvatar(data.avatar_url ?? null); }
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ name, phone }).eq("user_id", user.id);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("user_id", user.id);
    setAvatar(data.publicUrl);
    toast.success("Avatar updated");
  };

  return (
    <AccountLayout>
      <form onSubmit={save} className="bg-card border border-border rounded-lg p-6 max-w-lg space-y-4">
        <div className="flex items-center gap-4">
          {avatar ? <img src={avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-surface grid place-items-center text-xl font-bold">{(name || user?.email || "?")[0]?.toUpperCase()}</div>}
          <label className="text-sm cursor-pointer text-primary hover:underline">Upload new avatar
            <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
          </label>
        </div>
        <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
        <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Save changes</Button>
      </form>
    </AccountLayout>
  );
}