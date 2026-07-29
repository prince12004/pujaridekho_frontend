"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useAuditLogs } from "@/features/admin/api/use-audit-log";

export default function AuditLogPage() {
  const { data, isLoading } = useAuditLogs();

  return (
    <div>
      <AdminPageHeader title="Audit Log" description="Every create, update, delete and status change made by admins." />

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
                  <TableHead>When</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No activity recorded yet.
                    </TableCell>
                  </TableRow>
                )}
                {data?.items.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="text-muted-foreground">{new Date(log.createdAt).toLocaleString("en-IN")}</TableCell>
                    <TableCell>{log.adminName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.entityType}</TableCell>
                    <TableCell>{log.description}</TableCell>
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
