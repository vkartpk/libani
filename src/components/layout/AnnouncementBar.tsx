import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { safeStorage } from "@/lib/storage";

const KEY = "tz.announcement-dismissed";
const MESSAGE = "Free shipping on all orders above Rs.1000  •  Authentic Products  •  Cash on Delivery Available  •  24/7 Customer Support";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (safeStorage.get(KEY, false)) setOpen(false);
  }, []);
  if (!open) return null;
  return (
    <div className="bg-primary text-primary-foreground text-xs">
      <div className="container-x flex items-center gap-4 py-2">
        <div className="flex-1 overflow-hidden">
          <div className="marquee whitespace-nowrap inline-block">
            <span className="px-4">{MESSAGE}</span>
            <span className="px-4">{MESSAGE}</span>
          </div>
        </div>
        <button
          aria-label="Dismiss announcement"
          onClick={() => { setOpen(false); safeStorage.set(KEY, true); }}
          className="shrink-0 hover:opacity-80"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}