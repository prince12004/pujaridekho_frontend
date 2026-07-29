"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";

export function ProductBuyBox({
  slug,
  name,
  price,
  marketPrice,
  image,
  inStock,
}: {
  slug: string;
  name: string;
  price: number;
  marketPrice?: number;
  image?: string;
  inStock: boolean;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const item = { productSlug: slug, name, price, marketPrice, image };

  const handleAddToCart = () => {
    setAdding(true);
    addItem(item);
    toast.success(`${name} added to cart`);
    setTimeout(() => setAdding(false), 400);
  };

  const handleBuyNow = () => {
    addItem(item);
    router.push("/checkout");
  };

  return (
    <div className="mt-6 flex flex-col gap-2">
      <Button className="w-full" disabled={!inStock} onClick={handleBuyNow}>
        <Zap /> Buy Now
      </Button>
      <Button variant="outline" className="w-full" disabled={!inStock || adding} onClick={handleAddToCart}>
        <ShoppingCart /> Add to Cart
      </Button>
    </div>
  );
}
