"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import {
  useConvertPanditApplication,
  usePanditApplications,
  useUpdatePanditApplication,
} from "@/features/admin/api/use-pandits";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const STATUS_OPTIONS = ["pending", "under_review", "more_info_requested", "approved", "rejected"] as const;

export default function PanditApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data: applications, isLoading } = usePanditApplications(statusFilter || undefined);
  const updateMutation = useUpdatePanditApplication();
  const convertMutation = useConvertPanditApplication();

  const onStatusChange = async (id: string, status: string) => {
    try {
      await updateMutation.mutateAsync({ id, input: { status } });
      toast.success("Application updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onConvert = async (id: string, name: string) => {
    if (!confirm(`Convert "${name}"'s application into a live Pandit profile?`)) return;
    try {
      await convertMutation.mutateAsync(id);
      toast.success("Converted to a Pandit profile");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Pandit Applications" description="Review applications submitted from the public Become a Pandit form." />

      <div className="mb-4 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
                {applications?.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell className="font-medium">{app.fullName}</TableCell>
                    <TableCell className="text-muted-foreground">{app.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{app.city ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{app.specialization ?? "—"}</TableCell>
                    <TableCell>
                      <select
                        value={app.status}
                        onChange={(e) => onStatusChange(app._id, e.target.value)}
                        className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      {app.convertedPandit ? (
                        <Badge variant="outline">Converted</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => onConvert(app._id, app.fullName)}>
                          <UserCheck /> Convert
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
