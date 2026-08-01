"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Truck, Trash2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { DELIVERY_CHARGE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;

  if (items.length === 0) {
    return (
      <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">Browse our puja essentials and add something to your cart.</p>
        <Button asChild>
          <Link href="/products">Shop Products</Link>
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="font-heading mb-6 text-3xl font-bold">Your Cart</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productSlug} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => updateQuantity(item.productSlug, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus />
                </Button>
              </div>
              <p className="w-20 shrink-0 text-right font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
              <Button variant="ghost" size="icon-sm" onClick={() => removeItem(item.productSlug)} aria-label="Remove item">
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-3xl border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-bold">Order Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
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
            Free delivery on all orders.
          </p>
          <Button asChild size="lg" className="mt-5 w-full font-bold">
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
