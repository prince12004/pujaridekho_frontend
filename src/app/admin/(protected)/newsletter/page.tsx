"use client";

import { toast } from "sonner";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeleteNewsletterSubscriber, useNewsletterSubscribers } from "@/features/admin/api/use-newsletter-subscribers";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function NewsletterSubscribersPage() {
  const { data: subscribers, isLoading } = useNewsletterSubscribers();
  const deleteMutation = useDeleteNewsletterSubscriber();

  const onDelete = async (id: string, email: string) => {
    if (!confirm(`Remove subscriber "${email}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Subscriber removed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Newsletter Subscribers"
        description="Everyone who has subscribed via the website footer or blog newsletter form."
      />

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers && subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "active" ? "default" : "outline"} className="capitalize">
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => onDelete(sub._id, sub.email)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Mail className="size-8 text-muted-foreground" />
              <p className="font-medium text-foreground">No subscribers yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Emails collected from the newsletter forms on the website will show up here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
