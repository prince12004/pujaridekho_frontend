"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

/** "View full profile" link on a team card, opening the long-form profile. */
export function TeamProfileDialog({
  name,
  designation,
  photo,
  profile,
}: {
  name: string;
  designation: string;
  photo?: string;
  profile: string;
}) {
  const paragraphs = profile.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="font-ui mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:text-secondary"
        >
          View full profile <ArrowRight size={14} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="flex-row items-center gap-4 border-b border-border bg-gradient-to-r from-primary/10 via-brand-gold/10 to-transparent p-5 text-left sm:p-6">
          {photo ? (
            <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-primary/30">
              <Image src={photo} alt="" fill sizes="64px" className="object-cover object-top" />
            </span>
          ) : null}
          <span>
            <DialogTitle className="font-heading text-xl font-bold text-foreground">{name}</DialogTitle>
            <DialogDescription className="font-ui mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
              {designation}
            </DialogDescription>
          </span>
        </DialogHeader>
        <div className="space-y-4 p-5 text-[15px] leading-relaxed text-muted-foreground sm:p-6">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
