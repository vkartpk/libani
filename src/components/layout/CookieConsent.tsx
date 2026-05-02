import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { safeStorage } from "@/lib/storage";

const KEY = "tz.cookies-accepted";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!safeStorage.get(KEY, false)) setShow(true); }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:max-w-sm z-40 bg-card border border-border rounded-lg p-4 shadow-2xl">
      <p className="text-sm">We use cookies to improve your experience. By continuing, you accept our <a href="/policies/privacy" className="text-primary underline">privacy policy</a>.</p>
      <Button size="sm" className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { safeStorage.set(KEY, true); setShow(false); }}>
        Accept
      </Button>
    </div>
  );
}