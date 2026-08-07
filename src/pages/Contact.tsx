import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useCmsPage } from "@/hooks/useCms";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().min(1),
  message: z.string().trim().min(10).max(1000),
});
type Form = z.infer<typeof schema>;

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { page } = useCmsPage("contact");
  const intro = page?.content || "";
  const hours = (page?.sections as any)?.hours || "Mon–Sat 10:00 – 19:00";
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  return (
    <>
      <SEO title={page?.meta_title || "Contact | libani"} description={page?.meta_description || undefined} />
      <div className="container-x py-6">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-4">{page?.title || "Get in Touch"}</h1>
        {intro && <p className="mt-2 text-sm text-muted-foreground max-w-2xl whitespace-pre-line">{intro}</p>}
        <div className="mt-6 grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-lg p-6">
            {sent ? (
              <p className="text-success">Thanks! We'll get back to you soon.</p>
            ) : (
              <form onSubmit={handleSubmit(() => { setSent(true); toast.success("Message sent!"); })} className="space-y-3">
                <div><Label>Name</Label><Input {...register("name")} />{errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}</div>
                <div><Label>Email</Label><Input type="email" {...register("email")} />{errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}</div>
                <div><Label>Phone</Label><Input {...register("phone")} /></div>
                <div><Label>Subject</Label>
                  <Select onValueChange={(v) => setValue("subject", v)}>
                    <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="order">Order Issue</SelectItem>
                      <SelectItem value="returns">Returns</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subject && <p className="text-xs text-destructive mt-1">Required</p>}
                </div>
                <div><Label>Message</Label><Textarea rows={5} {...register("message")} />{errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}</div>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Send</Button>
              </form>
            )}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> <a href="tel:+923124339986" className="hover:text-primary">+92 3124339986</a></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> <a href="mailto:libaniofficial@gmail.com" className="hover:text-primary">libaniofficial@gmail.com</a></div>
            <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> IT Tower, Gulberg, Lahore. Pakistan</div>
            <p className="text-muted-foreground">{hours}</p>
          </div>
        </div>
      </div>
    </>
  );
}