"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MonogramAvatar } from "@/components/shared/monogram-avatar";

const commentSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  message: z.string().min(5, "Comment is too short"),
});

type CommentValues = z.infer<typeof commentSchema>;

export interface Comment {
  name: string;
  date: string;
  message: string;
}

export function CommentsSection({
  initialComments,
  className,
}: {
  initialComments: Comment[];
  className?: string;
}) {
  const [comments, setComments] = useState(initialComments);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentValues>({ resolver: zodResolver(commentSchema) });

  function onSubmit(values: CommentValues) {
    setComments((prev) => [
      { name: values.name, date: "Just now", message: values.message },
      ...prev,
    ]);
    reset();
  }

  return (
    <section className={className}>
      <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl">
        <MessageCircle className="text-primary" size={22} />
        Discussion ({comments.length})
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[200px_1fr]">
          <div>
            <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Name</Label>
            <input
              {...register("name")}
              placeholder="Your name"
              className="h-10 w-full rounded-lg border border-input bg-muted/60 px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
          </div>
          <div>
            <Label className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Comment</Label>
            <input
              {...register("message")}
              placeholder="Share your thoughts…"
              className="h-10 w-full rounded-lg border border-input bg-muted/60 px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.message ? <p className="mt-1 text-xs text-destructive">{errors.message.message}</p> : null}
          </div>
        </div>
        <Button type="submit" className="font-ui w-fit font-bold">
          Post Comment
        </Button>
      </form>

      <ul className="flex flex-col gap-5">
        {comments.map((comment, i) => (
          <li key={`${comment.name}-${i}`} className="flex gap-3.5">
            <MonogramAvatar
              initials={comment.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
              seed={i}
              className="h-10 w-10 shrink-0 text-xs"
            />
            <div className="flex-1 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{comment.name}</span>
                <span className="text-xs text-muted-foreground">{comment.date}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{comment.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
