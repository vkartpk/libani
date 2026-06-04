import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { safeStorage } from "@/lib/storage";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const KEY = "tz.announcement-dismissed";

export function AnnouncementBar() {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (safeStorage.get(KEY, false)) setOpen(false);
  }, []);
  if (!open) return null;
  if (!settings.announcement_enabled || !settings.announcement_text) return null;
  const MESSAGE = settings.announcement_text;
  const link = settings.announcement_link;
  return (
    <div className="bg-primary text-primary-foreground text-xs">
      <div className="container-x flex items-center gap-4 py-2">
        <div className="flex-1 overflow-hidden">
          <div className="marquee whitespace-nowrap inline-block">
            {link ? (
              <>
                <a href={link} className="px-4 hover:underline">{MESSAGE}</a>
                <a href={link} className="px-4 hover:underline">{MESSAGE}</a>
              </>
            ) : (
              <>
                <span className="px-4">{MESSAGE}</span>
                <span className="px-4">{MESSAGE}</span>
              </>
            )}
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