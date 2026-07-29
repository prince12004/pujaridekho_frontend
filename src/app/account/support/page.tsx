"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LifeBuoy, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import {
  type MySupportTicket,
  type SupportCategory,
  useCreateTicket,
  useMyTickets,
  useReplyToTicket,
} from "@/features/account/api/use-support";
import { formatDateTime } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

const CATEGORIES: { value: SupportCategory; label: string }[] = [
  { value: "booking", label: "Booking" },
  { value: "pandit", label: "Pandit" },
  { value: "payment", label: "Payment" },
  { value: "refund", label: "Refund" },
  { value: "order", label: "Order" },
  { value: "consultation", label: "Consultation" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

function toneForTicketStatus(status: string): "default" | "outline" | "secondary" | "destructive" {
  if (status === "resolved" || status === "closed") return "default";
  if (status === "waiting_for_customer") return "destructive";
  return "outline";
}

export default function SupportPage() {
  const { data: tickets, isLoading, isError, refetch } = useMyTickets();
  const createMutation = useCreateTicket();

  const [createOpen, setCreateOpen] = useState(false);
  const [category, setCategory] = useState<SupportCategory>("booking");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState<MySupportTicket | null>(null);

  async function handleCreate() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in subject and message");
      return;
    }
    try {
      await createMutation.mutateAsync({ category, subject, message });
      toast.success("Support ticket created");
      setCreateOpen(false);
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create ticket"));
    }
  }

  return (
    <div>
      <AccountPageHeader
        title="Support"
        description="Get help with your bookings, orders and payments."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="font-ui font-bold">New Ticket</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Raise a Support Ticket</DialogTitle>
                <DialogDescription>Our team typically responds within 24 hours.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="category" className="mb-1.5">Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as SupportCategory)}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject" className="mb-1.5">Subject</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="message" className="mb-1.5">Message</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={createMutation.isPending} className="font-ui font-bold">
                  {createMutation.isPending ? "Submitting..." : "Submit Ticket"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {tickets && tickets.length === 0 && (
        <AccountEmptyState icon={LifeBuoy} title="No support tickets yet." description="Facing an issue? Raise a ticket and our team will help." />
      )}

      {tickets && tickets.length > 0 && (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <Card key={ticket._id} className="cursor-pointer transition hover:border-primary/40" onClick={() => setActiveTicket(ticket)}>
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant={toneForTicketStatus(ticket.status)} className="capitalize">
                      {ticket.status.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs capitalize text-muted-foreground">{ticket.category}</span>
                  </div>
                  <p className="text-sm font-medium text-secondary">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    #{ticket.ticketNumber} · {formatDateTime(ticket.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!activeTicket} onOpenChange={(open) => !open && setActiveTicket(null)}>
        <DialogContent className="sm:max-w-lg">
          {activeTicket && <TicketConversation ticket={activeTicket} onUpdated={setActiveTicket} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TicketConversation({ ticket, onUpdated }: { ticket: MySupportTicket; onUpdated: (ticket: MySupportTicket) => void }) {
  const replyMutation = useReplyToTicket();
  const [reply, setReply] = useState("");

  async function handleReply() {
    if (!reply.trim()) return;
    try {
      const updated = await replyMutation.mutateAsync({ id: ticket._id, message: reply });
      onUpdated(updated);
      setReply("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not send message"));
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{ticket.subject}</DialogTitle>
        <DialogDescription>
          #{ticket.ticketNumber} · <span className="capitalize">{ticket.status.replace(/_/g, " ")}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-80 space-y-3 overflow-y-auto">
        {ticket.messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                message.sender === "customer" ? "bg-primary text-primary-foreground" : "bg-muted text-secondary"
              }`}
            >
              <p>{message.message}</p>
              <p className="mt-1 text-[10px] opacity-70">{formatDateTime(message.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      {!["resolved", "closed"].includes(ticket.status) && (
        <div className="flex gap-2">
          <Input placeholder="Type a message..." value={reply} onChange={(e) => setReply(e.target.value)} />
          <Button size="icon" onClick={handleReply} disabled={replyMutation.isPending} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
}
