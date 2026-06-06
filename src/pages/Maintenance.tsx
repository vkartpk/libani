import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Wrench } from "lucide-react";

export default function Maintenance() {
  const { settings } = useSiteSettings();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-lg text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">{settings.site_name} is offline</h1>
        <p className="text-muted-foreground">
          {settings.maintenance_message ||
            "We're doing some quick maintenance. Please check back shortly."}
        </p>
        {settings.maintenance_eta && (
          <p className="text-sm text-muted-foreground">
            Expected back: <span className="font-semibold">{settings.maintenance_eta}</span>
          </p>
        )}
      </div>
    </div>
  );
}