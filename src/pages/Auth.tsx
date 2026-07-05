import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const loginSchema = z.object({ email: z.string().email().max(255), password: z.string().min(6).max(72) });
const signupSchema = loginSchema.extend({ name: z.string().trim().min(2).max(100), phone: z.string().trim().min(7).max(20) });
const recoverySchema = z.object({ email: z.string().email().max(255) });

export default function Auth() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("login");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const li = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const su = useForm<z.infer<typeof signupSchema>>({ resolver: zodResolver(signupSchema) });
  const rp = useForm<z.infer<typeof recoverySchema>>({ resolver: zodResolver(recoverySchema) });

  useEffect(() => { if (user) nav("/", { replace: true }); }, [user, nav]);

  const onLogin = async (v: z.infer<typeof loginSchema>) => {
    const { error } = await supabase.auth.signInWithPassword({ email: v.email, password: v.password });
    if (error) toast.error(error.message); else toast.success("Welcome back!");
  };
  const onSignup = async (v: z.infer<typeof signupSchema>) => {
    const { error } = await supabase.auth.signUp({ email: v.email, password: v.password, options: { emailRedirectTo: `${window.location.origin}/`, data: { name: v.name, phone: v.phone } } });
    if (error) toast.error(error.message); else toast.success("Check your email to confirm.");
  };

  const onRecover = async (v: z.infer<typeof recoverySchema>) => {
    const { error } = await supabase.auth.resetPasswordForEmail(v.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message); else toast.success("Password reset link sent. Please check your email.");
  };

  const onGoogle = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/` });
    if (res.error) toast.error(res.error.message);
  };

  return (
    <>
      <SEO title="Sign in | TechZone" />
      <div className="container-x py-6 max-w-md">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Account" }]} />
        <div className="mt-6 bg-card border border-border rounded-lg p-6">
          {user ? (
            <div className="text-center"><p>Signed in as <strong>{user.email}</strong></p><Button onClick={signOut} variant="outline" className="mt-4">Sign out</Button></div>
          ) : (
          {recoveryMode ? (
            <form onSubmit={rp.handleSubmit(onRecover)} className="space-y-4">
              <div className="space-y-1">
                <h1 className="font-display text-xl font-bold">Reset password</h1>
                <p className="text-sm text-muted-foreground">Enter your email and we’ll send you a link to create a new password.</p>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" autoComplete="email" {...rp.register("email")} />
                {rp.formState.errors.email && <p className="text-xs text-destructive mt-1">{rp.formState.errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={rp.formState.isSubmitting}>Send reset link</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setRecoveryMode(false)}>Back to sign in</Button>
            </form>
          ) : (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 w-full"><TabsTrigger value="login">Sign in</TabsTrigger><TabsTrigger value="signup">Create account</TabsTrigger></TabsList>
            <Button type="button" onClick={onGoogle} variant="outline" className="w-full mt-4">Continue with Google</Button>
            <div className="relative my-4 text-center text-xs text-muted-foreground"><span className="bg-card px-2 relative z-10">or</span><div className="absolute inset-x-0 top-1/2 h-px bg-border" /></div>
            <TabsContent value="login">
              <form onSubmit={li.handleSubmit(onLogin)} className="space-y-3 mt-4">
                <div><Label>Email</Label><Input type="email" {...li.register("email")} />{li.formState.errors.email && <p className="text-xs text-destructive mt-1">{li.formState.errors.email.message}</p>}</div>
                <div><Label>Password</Label><Input type="password" {...li.register("password")} />{li.formState.errors.password && <p className="text-xs text-destructive mt-1">{li.formState.errors.password.message}</p>}</div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Sign in</Button>
                <Button type="button" variant="link" className="w-full h-auto p-0 text-sm" onClick={() => { rp.setValue("email", li.getValues("email") || ""); setRecoveryMode(true); }}>Forgot password?</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={su.handleSubmit(onSignup)} className="space-y-3 mt-4">
                <div><Label>Full name</Label><Input {...su.register("name")} />{su.formState.errors.name && <p className="text-xs text-destructive mt-1">{su.formState.errors.name.message}</p>}</div>
                <div><Label>Email</Label><Input type="email" {...su.register("email")} />{su.formState.errors.email && <p className="text-xs text-destructive mt-1">{su.formState.errors.email.message}</p>}</div>
                <div><Label>Phone</Label><Input {...su.register("phone")} />{su.formState.errors.phone && <p className="text-xs text-destructive mt-1">{su.formState.errors.phone.message}</p>}</div>
                <div><Label>Password</Label><Input type="password" {...su.register("password")} />{su.formState.errors.password && <p className="text-xs text-destructive mt-1">{su.formState.errors.password.message}</p>}</div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
          )}
          )}
        </div>
      </div>
    </>
  );
}