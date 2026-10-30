"use client";

import { useRef } from "react";
import { FluidHoverHighlight } from "@/components/fluid-hover-highlight";
import { useFluidHover } from "@/hooks/use-fluid-hover";
import { ServiceAccordionItem } from "./service-accordion-item";

interface ServiceAccordionProps {
  items: readonly { id: string; title: string; body: string }[];
  /** The open item, or null when all are closed. */
  open: number | null;
  onToggle: (index: number) => void;
}

/** The services as an accordion that keeps one item open at a time. */
export function ServiceAccordion({ items, open, onToggle }: ServiceAccordionProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const hover = useFluidHover(listRef, { axis: "y" });

  return (
    <ul ref={listRef} {...hover.handlers} className="relative border border-primary-foreground">
      <FluidHoverHighlight hover={hover} />
      {items.map((item, i) => (
        <ServiceAccordionItem
          key={item.id}
          index={i}
          title={item.title}
          body={item.body}
          open={open === i}
          onToggle={() => onToggle(i)}
          registerItem={hover.registerItem}
        />
      ))}
    </ul>
  );
}
