"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useDeleteSeoRedirect, useSaveSeoRedirect, useSeoRedirects } from "@/features/admin/api/use-seo-management";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

export default function RedirectsPage() {
  const { data: redirects, isLoading } = useSeoRedirects();
  const save = useSaveSeoRedirect();
  const remove = useDeleteSeoRedirect();
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302>(301);

  const add = async () => {
    try {
      await save.mutateAsync({ input: { fromPath, toPath, statusCode } });
      toast.success("Redirect added — active within a minute");
      setFromPath("");
      setToPath("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const toggle = async (id: string, r: { fromPath: string; toPath: string; statusCode: 301 | 302 | 308; isActive: boolean }) => {
    try {
      await save.mutateAsync({ id, input: { ...r, isActive: !r.isActive } });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="301 Redirects"
        description="Send visitors and Google from an old URL to its new address. Changing the URL of a live SEO page adds a redirect automatically."
      />
      <Card className="mb-4">
        <CardContent className="flex flex-wrap items-end gap-2 py-4">
          <Input value={fromPath} onChange={(e) => setFromPath(e.target.value)} placeholder="Old path, e.g. /pandit-noida" className="w-64" />
          <Input value={toPath} onChange={(e) => setToPath(e.target.value)} placeholder="New path, e.g. /pandit-in-noida" className="w-64" />
          <select value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302)} className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm">
            <option value={301}>301 Permanent</option>
            <option value={302}>302 Temporary</option>
          </select>
          <Button onClick={add} disabled={!fromPath || !toPath || save.isPending}>
            <Plus /> Add redirect
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redirects?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No redirects.</TableCell></TableRow>
                ) : null}
                {redirects?.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell className="font-mono text-xs">{r.fromPath}</TableCell>
                    <TableCell className="font-mono text-xs">{r.toPath}</TableCell>
                    <TableCell><Badge variant="outline">{r.statusCode}</Badge></TableCell>
                    <TableCell><input type="checkbox" checked={r.isActive} onChange={() => toggle(r._id, r)} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.note ?? ""}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={async () => {
                        if (!confirm(`Delete redirect ${r.fromPath}?`)) return;
                        try { await remove.mutateAsync(r._id); } catch (err) { toast.error(getErrorMessage(err)); }
                      }}>
                        <Trash2 />
                      </Button>
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
