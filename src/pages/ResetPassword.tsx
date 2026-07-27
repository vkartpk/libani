import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPassword() {
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [ready, setReady] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const hasRecoveryToken = hash.get("type") === "recovery" || Boolean(hash.get("access_token")) || Boolean(query.get("code"));
    setReady(hasRecoveryToken);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (pw !== confirmPw) { toast.error("Passwords do not match"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else { toast.success("Password updated. Please sign in again."); nav("/auth"); }
  };
  return (
    <>
      <SEO title="Reset password | TechZone" />
      <div className="container-x py-8 max-w-md">
        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h1 className="font-display text-xl font-bold">Set a new password</h1>
          {!ready && <p className="text-sm text-muted-foreground">If your reset link is expired or invalid, request a new link from the sign in page.</p>}
          <div><Label>New password</Label><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <div><Label>Confirm password</Label><PasswordInput value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} /></div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Update password</Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => nav("/auth")}>Back to sign in</Button>
        </form>
      </div>
    </>
  );
}
