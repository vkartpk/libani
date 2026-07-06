import { useState } from "react";
import { AccountLayout } from "./AccountLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Security() {
  const [pw, setPw] = useState("");
  const { signOut } = useAuth();
  const nav = useNavigate();

  const update = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else { toast.success("Password updated"); setPw(""); }
  };

  return (
    <AccountLayout>
      <div className="space-y-6 max-w-lg">
        <form onSubmit={update} className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h2 className="font-display font-bold">Change password</h2>
          <div><Label>New password</Label><PasswordInput type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Update password</Button>
        </form>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-display font-bold mb-2">Sign out</h2>
          <Button variant="outline" onClick={async () => { await signOut(); nav("/"); }}>Sign out of TechZone</Button>
        </div>
      </div>
    </AccountLayout>
  );
}