"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, ShoppingBag, Truck } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/features/cart/cart-context";
import { apiClient } from "@/lib/api-client";
import { useAuthModal } from "@/providers/auth-modal-provider";
import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

const checkoutSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  mobile: z.string().min(10, "Enter a valid mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Please enter your full address"),
  city: z.string().min(1, "Please enter your city"),
  pincode: z.string().min(4, "Enter a valid pincode"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { isLoggedIn, openLogin } = useAuthModal();
  const [isPlacing, setIsPlacing] = useState(false);
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({ resolver: zodResolver(checkoutSchema) });

  if (items.length === 0) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <Button asChild>
          <Link href="/products">Shop Products</Link>
        </Button>
      </Container>
    );
  }

  const onSubmit = async (values: CheckoutValues) => {
    if (!isLoggedIn) {
      openLogin(() => placeOrder(values), values.mobile);
      return;
    }
    await placeOrder(values);
  };

  const placeOrder = async (values: CheckoutValues) => {
    setIsPlacing(true);
    try {
      const orderRes = await apiClient.post("/orders", {
        customer: { name: values.name, mobile: values.mobile, email: values.email || undefined },
        items: items.map((i) => ({ productSlug: i.productSlug, quantity: i.quantity })),
        shippingAddress: { name: values.name, phone: values.mobile, address: values.address, city: values.city, pincode: values.pincode },
      });
      const order = orderRes.data.data;

      const payRes = await apiClient.post("/payments/payu/initiate", {
        entityType: "order",
        entityId: order._id,
        amount: order.total,
        name: values.name,
        email: values.email || "guest@pujaridekho.com",
        phone: values.mobile,
      });
      const { action, fields } = payRes.data.data;

      clear();

      const form = document.createElement("form");
      form.method = "POST";
      form.action = action;
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch {
      setIsPlacing(false);
    }
  };

  return (
    <Container className="py-10">
      <h1 className="font-heading mb-6 text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold">Shipping Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Mobile</Label>
              <Input {...register("mobile")} />
              {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email (optional)</Label>
            <Input {...register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Textarea rows={2} {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input {...register("city")} />
              {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Pincode</Label>
              <Input {...register("pincode")} />
              {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full font-bold" disabled={isPlacing}>
            {isPlacing && <Loader2 className="size-4 animate-spin" />}
            Pay ₹{total.toLocaleString("en-IN")} Now
          </Button>
        </form>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.productSlug} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className={deliveryCharge > 0 ? "font-semibold" : "font-semibold text-emerald-600"}>
              {deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base font-bold">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <Truck className="mt-0.5 size-3.5 shrink-0 text-primary" />
            Delivery Charge: ₹{DELIVERY_CHARGE}. Free delivery on orders above ₹{FREE_DELIVERY_THRESHOLD}.
          </p>
        </div>
      </div>
    </Container>
  );
}
