import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-[90%] max-w-[1600px]", className)}>
      {children}
    </div>
  );
}
