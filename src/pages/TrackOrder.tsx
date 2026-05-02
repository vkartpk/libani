import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Package, Check, Truck, Home } from "lucide-react";

export default function TrackOrder() {
  const [shown, setShown] = useState(false);
  const steps = [
    { icon: Check, label: "Order Placed", time: "Today, 09:32" },
    { icon: Check, label: "Processing", time: "Today, 14:10" },
    { icon: Truck, label: "Shipped", time: "In transit", active: true },
    { icon: Truck, label: "Out for Delivery", time: "Pending" },
    { icon: Home, label: "Delivered", time: "Pending" },
  ];
  return (
    <>
      <SEO title="Track Order | TechZone" />
      <div className="container-x py-6 max-w-2xl">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Track Order" }]} />
        <div className="mt-6 bg-card border border-border rounded-lg p-6 md:p-8">
          <div className="flex items-center gap-3"><Package className="h-6 w-6 text-primary" /><h1 className="font-display text-xl font-bold">Track Your Order</h1></div>
          <form onSubmit={(e) => { e.preventDefault(); setShown(true); }} className="mt-5 space-y-3">
            <div><Label>Order number</Label><Input required placeholder="TZ123456" /></div>
            <div><Label>Email or phone</Label><Input required placeholder="you@example.com" /></div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Track</Button>
          </form>

          {shown && (
            <div className="mt-8 border-t border-border pt-6">
              <div className="flex justify-between text-sm mb-4"><div><p className="text-muted-foreground text-xs">Order</p><p className="font-mono">TZ123456</p></div><div className="text-right"><p className="text-muted-foreground text-xs">Estimated delivery</p><p>Tomorrow</p></div></div>
              <ol className="space-y-4">{steps.map((s) => (
                <li key={s.label} className="flex gap-3">
                  <span className={`grid place-items-center h-8 w-8 rounded-full ${s.active ? "bg-primary text-primary-foreground" : s.time === "Pending" ? "bg-surface text-muted-foreground" : "bg-success text-success-foreground"}`}><s.icon className="h-4 w-4" /></span>
                  <div><p className="font-medium text-sm">{s.label}</p><p className="text-xs text-muted-foreground">{s.time}</p></div>
                </li>
              ))}</ol>
            </div>
          )}
        </div>
      </div>
    </>
  );
}