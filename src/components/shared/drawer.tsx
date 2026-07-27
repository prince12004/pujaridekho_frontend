"use client";

import {
  Drawer as DrawerPrimitive,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export function Drawer({
  open,
  onOpenChange,
  direction = "right",
  title,
  description,
  footer,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  direction?: "left" | "right" | "top" | "bottom";
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DrawerPrimitive open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent className={cn("bg-card", className)}>
        {(title || description) && (
          <DrawerHeader>
            {title ? <DrawerTitle className="font-heading text-lg">{title}</DrawerTitle> : null}
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
        )}
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
        {footer ? <DrawerFooter>{footer}</DrawerFooter> : null}
      </DrawerContent>
    </DrawerPrimitive>
  );
}
