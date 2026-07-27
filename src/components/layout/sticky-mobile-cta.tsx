import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-sm md:hidden">
      <Button asChild size="lg" className="font-ui w-full font-bold">
        <Link href="#book">
          <Flame /> Book Puja Now
        </Link>
      </Button>
    </div>
  );
}
