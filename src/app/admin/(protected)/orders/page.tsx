"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { useAdminAuth } from "@/features/admin/auth/admin-auth-context";
import { type Order, useDeleteOrder, useOrders, useResolveOrderCancelRequest, useUpdateOrderStatus } from "@/features/admin/api/use-orders";
import { getErrorMessage } from "@/features/admin/lib/get-error-message";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"] as const;

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  // "cancel_requests" is a pseudo-filter: orders with a pending customer cancellation request.
  const { data, isLoading } = useOrders({
    search: search || undefined,
    status: statusFilter && statusFilter !== "cancel_requests" ? statusFilter : undefined,
    cancelRequest: statusFilter === "cancel_requests" ? "requested" : undefined,
    page,
  });
  const resolveCancel = useResolveOrderCancelRequest();
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const { hasPermission } = useAdminAuth();
  const isSuperAdmin = hasPermission("*");

  const onStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Order updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onResolveCancel = async (order: Order, decision: "approve" | "reject") => {
    const question =
      decision === "approve"
        ? `Cancel order ${order.orderId}? The customer will be notified${order.paymentStatus === "paid" ? " — remember to process the refund" : ""}.`
        : `Reject the cancellation request for ${order.orderId}?`;
    if (!confirm(question)) return;
    try {
      await resolveCancel.mutateAsync({ id: order._id, decision });
      toast.success(decision === "approve" ? "Order cancelled — customer notified" : "Request rejected — customer notified");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const onDelete = async (id: string, orderId: string) => {
    if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
    try {
      await deleteOrder.mutateAsync(id);
      toast.success("Order deleted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Orders" description="Track and fulfill puja essentials orders placed through the shop." />

      <div className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Search order ID / customer..." className="w-64" value={search} onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }} />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="cancel_requests">Cancellation requests</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
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
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isSuperAdmin ? 7 : 6} className="text-center text-muted-foreground">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {data?.items.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <p>{order.customerSnapshot?.name}</p>
                        <p className="text-xs text-muted-foreground">{order.customerSnapshot?.mobile}</p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{order.items.length} item(s)</TableCell>
                      <TableCell>₹{order.total.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <Badge variant={order.paymentStatus === "paid" ? "default" : "outline"}>{order.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order._id, e.target.value)}
                          className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {order.cancelRequest?.status === "requested" ? (
                          <div className="mt-2 max-w-xs space-y-1.5 rounded-md border border-destructive/30 bg-destructive/5 p-2">
                            <p className="text-xs font-semibold text-destructive">Cancellation requested</p>
                            <p className="text-xs text-muted-foreground">{order.cancelRequest.reason}</p>
                            <div className="flex gap-1.5">
                              <Button size="xs" variant="destructive" disabled={resolveCancel.isPending} onClick={() => onResolveCancel(order, "approve")}>
                                <Check /> Approve
                              </Button>
                              <Button size="xs" variant="outline" disabled={resolveCancel.isPending} onClick={() => onResolveCancel(order, "reject")}>
                                <X /> Reject
                              </Button>
                            </div>
                          </div>
                        ) : order.cancelRequest ? (
                          <p className="mt-1 text-[11px] text-muted-foreground">Cancel request {order.cancelRequest.status}</p>
                        ) : null}
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(order._id, order.orderId)}>
                            <Trash2 />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <AdminPagination page={page} totalPages={data?.totalPages ?? 1} total={data?.total ?? 0} onPageChange={setPage} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
