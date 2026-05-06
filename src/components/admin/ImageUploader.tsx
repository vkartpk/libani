import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "product-images";

async function uploadOne(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function ImageUploader({
  value,
  onChange,
  multiple = true,
  folder = "products",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [drag, setDrag] = useState(false);

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const f of arr) {
        if (f.size > 5 * 1024 * 1024) {
          toast.error(`${f.name} is larger than 5MB`);
          continue;
        }
        try {
          uploaded.push(await uploadOne(f, folder));
        } catch (e: any) {
          toast.error(`Upload failed: ${e.message}`);
        }
      }
      if (uploaded.length) {
        onChange(multiple ? [...value, ...uploaded] : [uploaded[0]]);
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? "s" : ""}`);
      }
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const addByUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    onChange(multiple ? [...value, u] : [u]);
    setUrlInput("");
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {busy ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground py-2">
            <Upload className="h-5 w-5" />
            <span>Drop images here or click to upload</span>
            <span className="text-xs">PNG, JPG, WEBP up to 5MB{multiple ? " — multiple allowed" : ""}</span>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group border rounded-md overflow-hidden bg-muted aspect-square">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 grid place-items-center h-6 w-6 rounded-full bg-background/90 border opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
              {multiple && (
                <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition">
                  <button type="button" onClick={() => move(i, -1)} className="text-xs px-1.5 py-0.5 rounded bg-background/90 border" disabled={i === 0}>←</button>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/90 border">{i + 1}</span>
                  <button type="button" onClick={() => move(i, 1)} className="text-xs px-1.5 py-0.5 rounded bg-background/90 border" disabled={i === value.length - 1}>→</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addByUrl())}
        />
        <Button type="button" variant="outline" onClick={addByUrl} disabled={!urlInput.trim()}>Add</Button>
      </div>
    </div>
  );
}

export function SingleImageUploader({
  value,
  onChange,
  folder = "misc",
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder?: string;
}) {
  return (
    <ImageUploader
      value={value ? [value] : []}
      onChange={(arr) => onChange(arr[0] || null)}
      multiple={false}
      folder={folder}
    />
  );
}