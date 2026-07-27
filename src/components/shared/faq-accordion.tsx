import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export interface FaqAccordionItem {
  question: string;
  answer: string;
}

export function FaqAccordion({
  items,
  className,
}: {
  items: FaqAccordionItem[];
  className?: string;
}) {
  return (
    <Accordion type="single" collapsible className={cn("rounded-2xl border border-border bg-card px-6", className)}>
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="font-heading py-5 text-base hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
