"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Code2, Heading2, Heading3, Italic, Link2, List, ListOrdered, Pilcrow, Quote, RemoveFormatting, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Lightweight rich-text editor (no extra dependency). Produces HTML that the
// API sanitises on save, so only headings, paragraphs, lists, links, quotes,
// tables and images survive.
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the page content…",
  minHeight = 320,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const lastEmitted = useRef<string>(value);

  // Only push external changes into the DOM (e.g. when a different page
  // loads) — never on our own keystrokes, which would reset the caret.
  useEffect(() => {
    if (mode === "visual" && ref.current && value !== lastEmitted.current) {
      ref.current.innerHTML = value || "";
      lastEmitted.current = value;
    }
  }, [value, mode]);

  useEffect(() => {
    if (mode === "visual" && ref.current) ref.current.innerHTML = value || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const emit = () => {
    const html = ref.current?.innerHTML ?? "";
    lastEmitted.current = html;
    onChange(html);
  };

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const addLink = () => {
    const url = window.prompt("Link URL (e.g. /pandit-in-noida or https://…)");
    if (url) exec("createLink", url.trim());
  };

  const tools = [
    { icon: Heading2, label: "Heading 2", run: () => exec("formatBlock", "h2") },
    { icon: Heading3, label: "Heading 3", run: () => exec("formatBlock", "h3") },
    { icon: Pilcrow, label: "Paragraph", run: () => exec("formatBlock", "p") },
    { icon: Bold, label: "Bold", run: () => exec("bold") },
    { icon: Italic, label: "Italic", run: () => exec("italic") },
    { icon: List, label: "Bullet list", run: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered list", run: () => exec("insertOrderedList") },
    { icon: Quote, label: "Quote", run: () => exec("formatBlock", "blockquote") },
    { icon: Link2, label: "Add link", run: addLink },
    { icon: Unlink, label: "Remove link", run: () => exec("unlink") },
    { icon: RemoveFormatting, label: "Clear formatting", run: () => exec("removeFormat") },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-input">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-muted/40 p-1">
        {mode === "visual"
          ? tools.map(({ icon: Icon, label, run }) => (
              <Button key={label} type="button" variant="ghost" size="icon-sm" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={run}>
                <Icon />
              </Button>
            ))
          : null}
        <Button
          type="button"
          variant={mode === "html" ? "secondary" : "ghost"}
          size="sm"
          className="ml-auto"
          onClick={() => setMode(mode === "visual" ? "html" : "visual")}
        >
          <Code2 /> {mode === "visual" ? "HTML" : "Visual"}
        </Button>
      </div>
      {mode === "visual" ? (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder}
          onInput={emit}
          onBlur={emit}
          style={{ minHeight }}
          className={cn(
            "prose-policy max-w-none p-4 text-sm outline-none",
            "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
            "[&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:pl-3 [&_p]:my-2",
          )}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => {
            lastEmitted.current = e.target.value;
            onChange(e.target.value);
          }}
          rows={16}
          className="rounded-none border-0 font-mono text-xs focus-visible:ring-0"
        />
      )}
    </div>
  );
}
