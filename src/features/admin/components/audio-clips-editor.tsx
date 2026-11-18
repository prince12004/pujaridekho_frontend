"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, Music, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readAudioDuration, uploadAudioFile, validateAudioFile } from "@/features/admin/lib/upload-audio";

export interface AudioClipValue {
  _id?: string;
  title: string;
  language: string;
  url: string;
  durationSec: number | null;
  isActive: boolean;
}

function formatDuration(sec: number | null) {
  if (sec == null) return "";
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function ClipRow({
  clip,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  clip: AudioClipValue;
  index: number;
  total: number;
  onChange: (patch: Partial<AudioClipValue>) => void;
  onMove: (delta: number) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const error = validateAudioFile(file);
    if (error) return toast.error(error);
    setUploading(true);
    setProgress(0);
    try {
      const [result, localDuration] = await Promise.all([uploadAudioFile(file, setProgress), readAudioDuration(file)]);
      onChange({ url: result.url, durationSec: result.durationSec ?? localDuration, title: clip.title || file.name.replace(/\.[^.]+$/, "") });
      toast.success("Audio uploaded");
    } catch {
      toast.error("Could not upload audio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px_120px]">
        <div className="space-y-1">
          <Label className="text-xs">Title</Label>
          <Input value={clip.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Satyanarayan Katha ka mahatva" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Language</Label>
          <select
            value={clip.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
          >
            <option value="hi">Hindi</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Duration (sec)</Label>
          <Input
            type="number"
            min={0}
            value={clip.durationSec ?? ""}
            onChange={(e) => onChange({ durationSec: e.target.value === "" ? null : Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input ref={inputRef} type="file" accept=".mp3,.m4a,audio/mpeg,audio/mp4,audio/x-m4a" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />} {uploading ? `Uploading ${progress}%` : clip.url ? "Replace file" : "Upload MP3 / M4A"}
        </Button>
        {clip.url ? (
          <audio controls preload="none" src={clip.url} className="h-8 max-w-full flex-1">
            <track kind="captions" />
          </audio>
        ) : (
          <span className="text-xs text-muted-foreground">Max 10 MB · 2–5 minute clips recommended</span>
        )}
        {clip.durationSec != null ? <span className="text-xs text-muted-foreground">{formatDuration(clip.durationSec)}</span> : null}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={clip.isActive} onChange={(e) => onChange({ isActive: e.target.checked })} /> Active (shown in the app)
        </label>
        <div className="flex">
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move up">
            <ArrowUp />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Move down">
            <ArrowDown />
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove clip">
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Add / remove / reorder audio clips. Order in the list = sortOrder. */
export function AudioClipsEditor({ value, onChange }: { value: AudioClipValue[]; onChange: (clips: AudioClipValue[]) => void }) {
  const move = (i: number, delta: number) => {
    const next = [...value];
    const j = i + delta;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music size={16} /> No audio clips yet. Add a short clip about this puja — e.g. its importance, katha summary or vidhi.
        </p>
      ) : null}
      {value.map((clip, i) => (
        <ClipRow
          key={clip._id ?? `new-${i}`}
          clip={clip}
          index={i}
          total={value.length}
          onChange={(patch) => onChange(value.map((c, j) => (j === i ? { ...c, ...patch } : c)))}
          onMove={(d) => move(i, d)}
          onRemove={() => onChange(value.filter((_, j) => j !== i))}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { title: "", language: "hi", url: "", durationSec: null, isActive: true }])}
      >
        <Plus /> Add audio clip
      </Button>
    </div>
  );
}
