import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterBanner() {
  return (
    <section className="container-x mt-14">
      <div className="rounded-xl bg-gradient-to-br from-primary/20 via-card to-card border border-border p-8 md:p-12 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold">Get Exclusive Deals & Updates</h2>
        <p className="mt-2 text-muted-foreground">Subscribe to our newsletter and never miss a flash sale.</p>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("You're in! Check your inbox."); (e.currentTarget as HTMLFormElement).reset(); }}
          className="mt-5 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <Input type="email" required placeholder="you@example.com" className="bg-background" />
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}