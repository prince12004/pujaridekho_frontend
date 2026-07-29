"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { downloadInvoicePdf, useMyInvoiceDetail, useMyInvoices } from "@/features/account/api/use-invoices";
import { formatCurrency, formatDate } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

const TYPE_LABELS: Record<string, string> = { booking: "Pooja Booking", order: "Product Order", consultation: "Consultation" };

export default function InvoicesPage() {
  const { data, isLoading, isError, refetch } = useMyInvoices();
  const [selected, setSelected] = useState<{ type: string; id: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownload(type: string, id: string, invoiceNumber: string) {
    setDownloadingId(invoiceNumber);
    try {
      await downloadInvoicePdf(type, id, invoiceNumber);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not download invoice"));
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div>
      <AccountPageHeader title="Invoices" description="Download or review invoices for anything you've paid for." />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <AccountEmptyState icon={FileText} title="No invoices yet." description="Invoices appear here once you've made a payment." />
      )}

      {data && data.length > 0 && (
        <div className="space-y-2">
          {data.map((invoice) => (
            <Card key={invoice.invoiceNumber}>
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-secondary">{invoice.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {TYPE_LABELS[invoice.type] ?? invoice.type} · {formatDate(invoice.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-secondary">{formatCurrency(invoice.amount)}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-ui font-bold"
                    onClick={() => setSelected({ type: invoice.type, id: invoice.referenceId })}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="font-ui font-bold"
                    disabled={downloadingId === invoice.invoiceNumber}
                    onClick={() => handleDownload(invoice.type, invoice.referenceId, invoice.invoiceNumber)}
                  >
                    {downloadingId === invoice.invoiceNumber ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && <InvoiceDetail type={selected.type} id={selected.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceDetail({ type, id }: { type: string; id: string }) {
  const { data: invoice, isLoading, isError } = useMyInvoiceDetail(type, id);
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) return <p className="py-6 text-center text-sm text-muted-foreground">Loading invoice...</p>;
  if (isError || !invoice) return <p className="py-6 text-center text-sm text-destructive">Could not load this invoice.</p>;

  async function handleDownload() {
    setIsDownloading(true);
    try {
      await downloadInvoicePdf(type, id, invoice!.invoiceNumber);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not download invoice"));
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between gap-3">
          <DialogTitle>{invoice.invoiceNumber}</DialogTitle>
          <Button size="sm" className="font-ui font-bold" disabled={isDownloading} onClick={handleDownload}>
            {isDownloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Download
          </Button>
        </div>
        <DialogDescription>{formatDate(invoice.date)}</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-2">
          {invoice.lineItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name}
                {item.quantity ? ` × ${item.quantity}` : ""}
              </span>
              <span className="font-medium text-secondary">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
        {invoice.discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-secondary">-{formatCurrency(invoice.discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-sm font-bold">
          <span>Total</span>
          <span>{formatCurrency(invoice.total)}</span>
        </div>
        <p className="text-xs capitalize text-muted-foreground">Payment status: {invoice.paymentStatus}</p>
      </div>
    </>
  );
}
