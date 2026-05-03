import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPassword() {
  const [pw, setPw] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { toast.error("Min 6 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else { toast.success("Password reset"); nav("/account"); }
  };
  return (
    <>
      <SEO title="Reset password | TechZone" />
      <div className="container-x py-8 max-w-md">
        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h1 className="font-display text-xl font-bold">Set a new password</h1>
          <div><Label>New password</Label><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Update password</Button>
        </form>
      </div>
    </>
  );
}
