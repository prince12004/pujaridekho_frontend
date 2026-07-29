"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountPageHeader } from "@/features/account/components/account-page-header";
import { AccountEmptyState } from "@/features/account/components/empty-state";
import { AccountLoadingSkeleton, AccountErrorState } from "@/features/account/components/state-blocks";
import { useMyWishlist, useRemoveFromWishlist } from "@/features/account/api/use-wishlist";
import { formatCurrency } from "@/features/account/lib/format";
import { getErrorMessage } from "@/features/account/lib/get-error-message";

const ITEM_TYPE_HREF: Record<string, string> = { pooja: "/poojas", product: "/products", festival: "/festivals" };

export default function WishlistPage() {
  const { data, isLoading, isError, refetch } = useMyWishlist();
  const removeMutation = useRemoveFromWishlist();

  async function handleRemove(itemType: string, itemId: string) {
    try {
      await removeMutation.mutateAsync({ itemType, itemId });
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not remove item"));
    }
  }

  return (
    <div>
      <AccountPageHeader title="Wishlist" description="Poojas, Festivals and Products you've saved for later." />

      {isLoading && <AccountLoadingSkeleton />}
      {isError && <AccountErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <AccountEmptyState
          icon={Heart}
          title="Your wishlist is empty."
          description="Save Poojas, Products or Festivals you're interested in — they'll show up here."
          ctaLabel="Explore Poojas"
          ctaHref="/poojas"
        />
      )}

      {data && data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((entry) => {
            const item = entry.item;
            if (!item) return null;
            const price = item.sellingPrice ?? item.startingPrice ?? item.marketPrice;
            const image = item.featuredImage ?? item.images?.[0];
            return (
              <Card key={`${entry.itemType}-${entry.itemId}`} className="overflow-hidden">
                <div className="relative h-36 w-full bg-muted">
                  {image && <Image src={image} alt={item.name} fill unoptimized className="object-cover" />}
                  <Badge className="absolute left-2 top-2 capitalize" variant="secondary">
                    {entry.itemType}
                  </Badge>
                </div>
                <CardContent className="space-y-2 p-4">
                  <p className="truncate text-sm font-semibold text-secondary">{item.name}</p>
                  {price !== undefined && <p className="text-sm font-medium text-primary">{formatCurrency(price)}</p>}
                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1 font-ui font-bold">
                      <Link href={`${ITEM_TYPE_HREF[entry.itemType]}/${item.slug ?? item._id}`}>View</Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                      aria-label="Remove from wishlist"
                      onClick={() => handleRemove(entry.itemType, entry.itemId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
