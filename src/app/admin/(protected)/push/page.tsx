"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, BellRing, Loader2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useBookingCities } from "@/features/admin/api/use-bookings";
import { type PushCampaignInput, usePushCampaigns, usePushCustomerSearch, useSendPush } from "@/features/admin/api/use-push";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const selectClass = "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none";

export default function PushNotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: history, isLoading } = usePushCampaigns(page);
  const { data: cities } = useBookingCities();
  const send = useSendPush();

  const [audienceType, setAudienceType] = useState<PushCampaignInput["audience"]["type"]>("all");
  const [city, setCity] = useState("");
  const [customerQuery, setCustomerQuery] = useState("");
  const [customer, setCustomer] = useState<{ _id: string; name: string; mobile: string; devices: number } | null>(null);
  const { data: customerResults } = usePushCustomerSearch(customer ? "" : customerQuery);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saveInApp, setSaveInApp] = useState(true);

  const audienceLabel =
    audienceType === "all" ? "all customers" : audienceType === "city" ? `customers in ${city || "…"}` : customer ? `${customer.name} (${customer.mobile})` : "…";

  const onSend = async () => {
    if (!title.trim() || !message.trim()) return toast.error("Title and message are required");
    if (audienceType === "city" && !city) return toast.error("Choose a city");
    if (audienceType === "customer" && !customer) return toast.error("Search and choose a customer");
    if (link && !link.startsWith("/")) return toast.error("Link must be a website path like /poojas/satyanarayan-katha");
    if (!confirm(`Send "${title}" to ${audienceLabel}?`)) return;
    try {
      const { campaign, message: resultMessage } = await send.mutateAsync({
        audience: { type: audienceType, city: audienceType === "city" ? city : undefined, customerId: audienceType === "customer" ? customer?._id : undefined },
        title: title.trim(),
        message: message.trim(),
        link: link.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        saveInApp,
      });
      toast.success(`${resultMessage}: ${campaign.sentCount} delivered, ${campaign.failedCount} failed (${campaign.customerCount} customers).`);
      setTitle("");
      setMessage("");
      setLink("");
      setImageUrl("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Push Notifications" description="Send a notification to customers' phones (Pujari Dekho app). Booking updates and reminders are sent automatically." />

      {history && !history.pushConfigured ? (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          Push is not configured on the server yet (FIREBASE_SERVICE_ACCOUNT). Messages are still saved to customers&apos; in-app notifications when that option is on.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing size={18} /> Send notification
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1">
              <Label>Audience</Label>
              <select value={audienceType} onChange={(e) => setAudienceType(e.target.value as typeof audienceType)} className={selectClass}>
                <option value="all">All customers</option>
                <option value="city">Customers in a city</option>
                <option value="customer">One customer</option>
              </select>
            </div>
            {audienceType === "city" ? (
              <div className="space-y-1">
                <Label>City</Label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                  <option value="">Choose a city…</option>
                  {cities?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">Customers with a booking or a saved address in this city.</p>
              </div>
            ) : null}
            {audienceType === "customer" ? (
              <div className="space-y-1">
                <Label>Customer</Label>
                {customer ? (
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <span>
                      {customer.name} · {customer.mobile}
                      <span className="ml-2 text-xs text-muted-foreground">{customer.devices} device{customer.devices === 1 ? "" : "s"}</span>
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setCustomer(null)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input value={customerQuery} onChange={(e) => setCustomerQuery(e.target.value)} placeholder="Search by mobile or name" />
                    {customerResults?.length ? (
                      <ul className="max-h-48 overflow-y-auto rounded-lg border border-border">
                        {customerResults.map((c) => (
                          <li key={c._id}>
                            <button type="button" onClick={() => setCustomer(c)} className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-muted">
                              <span>
                                {c.name} · {c.mobile}
                              </span>
                              <span className="text-xs text-muted-foreground">{c.devices} device{c.devices === 1 ? "" : "s"}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : customerQuery.trim().length >= 3 ? (
                      <p className="text-xs text-muted-foreground">No customers found.</p>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label>Title</Label>
                <span className={`text-xs ${title.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>{title.length}/60</span>
              </div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Book your Diwali Lakshmi Puja" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label>Message</Label>
                <span className={`text-xs ${message.length > 180 ? "text-destructive" : "text-muted-foreground"}`}>{message.length}/180</span>
              </div>
              <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Link (optional)</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/poojas/satyanarayan-katha" />
              <p className="text-xs text-muted-foreground">A website path. The app opens the matching screen when the notification is tapped.</p>
            </div>
            <div className="space-y-1">
              <Label>Image URL (optional)</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={saveInApp} onChange={(e) => setSaveInApp(e.target.checked)} /> Also save to customers&apos; in-app notifications
            </label>
            <Button onClick={onSend} disabled={send.isPending || title.length > 60 || message.length > 180}>
              {send.isPending ? <Loader2 className="animate-spin" /> : <Send />} Send to {audienceLabel}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="text-right">Sent</TableHead>
                      <TableHead className="text-right">Failed</TableHead>
                      <TableHead>Sent by</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history?.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Nothing sent yet.
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {history?.items.map((c) => (
                      <TableRow key={c._id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {new Date(c.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </TableCell>
                        <TableCell>
                          {c.audience.label}
                          <div className="text-xs text-muted-foreground">{c.customerCount} customers</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{c.title}</div>
                          <div className="max-w-xs truncate text-xs text-muted-foreground">{c.message}</div>
                          {!c.pushConfigured ? (
                            <Badge variant="outline" className="mt-1">
                              in-app only
                            </Badge>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right">{c.sentCount}</TableCell>
                        <TableCell className="text-right">{c.failedCount}</TableCell>
                        <TableCell className="text-muted-foreground">{c.sentByName ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <AdminPagination page={page} totalPages={history?.totalPages ?? 1} total={history?.total ?? 0} onPageChange={setPage} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
