"use client";

import { Loader2, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useHomeLeads } from "@/features/admin/api/use-leads";

export default function HomeLeadsPage() {
  const { data: leads, isLoading } = useHomeLeads();

  return (
    <div>
      <AdminPageHeader
        title="Homepage Enquiries"
        description="Everyone who submitted the 'Book Your Puja' form on the homepage."
      />

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : leads && leads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Puja</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Submitted On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.mobile}</TableCell>
                    <TableCell>{lead.city}</TableCell>
                    <TableCell className="max-w-xs truncate">{lead.address}</TableCell>
                    <TableCell>{lead.pooja}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.date).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="font-medium text-foreground">No enquiries yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Submissions from the homepage &quot;Book Your Puja&quot; form will show up here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
