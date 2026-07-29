import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { env } from "@/lib/env";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  product?: { marketPrice?: number };
}

interface OrderData {
  orderId: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customerSnapshot: { name: string; mobile: string; email?: string };
  shippingAddress: { name: string; phone: string; address: string; city: string; pincode: string };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
}

async function fetchOrder(id: string): Promise<OrderData | null> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orders/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await fetchOrder(id);
  if (!order) notFound();

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-bold">Order Details</h1>
        <Badge variant={order.paymentStatus === "paid" ? "default" : "outline"} className="text-sm capitalize">
          {order.status.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 border-l-4 border-primary pl-3 font-heading text-lg font-bold">Order Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Order ID" value={order.orderId} />
            <Field label="Order Date" value={new Date(order.createdAt).toLocaleString("en-IN")} />
            <Field label="Payment Status" value={order.paymentStatus.replace(/_/g, " ")} className="capitalize" />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 border-l-4 border-primary pl-3 font-heading text-lg font-bold">Customer Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Name" value={order.customerSnapshot?.name} />
            <Field label="Mobile" value={order.customerSnapshot?.mobile} />
            <Field label="Email" value={order.customerSnapshot?.email || "—"} />
          </div>
          <div className="mt-4">
            <Field
              label="Address"
              value={`${order.shippingAddress.address}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}`}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 border-l-4 border-primary pl-3 font-heading text-lg font-bold">Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-bold uppercase text-muted-foreground">
                  <th className="py-2">Item</th>
                  <th className="py-2">Market Price</th>
                  <th className="py-2">Offer Price</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3">{item.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {item.product?.marketPrice ? `₹${item.product.marketPrice.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="py-3">₹{item.price.toLocaleString("en-IN")}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3 text-right font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 border-l-4 border-primary pl-3 font-heading text-lg font-bold">Payment Summary</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Subtotal" value={`₹${order.subtotal.toLocaleString("en-IN")}`} />
            <Field label="Delivery" value={order.shippingCharge ? `₹${order.shippingCharge.toLocaleString("en-IN")}` : "Free"} />
            <Field label="Total" value={`₹${order.total.toLocaleString("en-IN")}`} className="text-lg font-bold text-primary" />
          </div>
        </section>
      </div>
    </Container>
  );
}

function Field({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-medium ${className ?? ""}`}>{value}</p>
    </div>
  );
}
