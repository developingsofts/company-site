"use client";

import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { useRegisterFluidHoverItem } from "@/hooks/use-fluid-hover";
import { fontWeights } from "@/lib/font-weight";
import { spring } from "@/lib/springs";
import { typeClass } from "@/lib/type-scale";

const titleScale = {
  "--fs-display": "clamp(1.25rem, 3svh, 1.75rem)",
  "--lh-display": "1.2",
} as CSSProperties;

interface ServiceAccordionItemProps {
  index: number;
  title: string;
  body: string;
  open: boolean;
  onToggle: () => void;
  registerItem: (index: number, element: HTMLElement | null) => void;
}

export function ServiceAccordionItem({ index, title, body, open, onToggle, registerItem }: ServiceAccordionItemProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const triggerId = useId();
  const panelId = useId();
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const [bodyHeight, setBodyHeight] = useState(0);
  useRegisterFluidHoverItem(registerItem, index, triggerRef);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const observer = new ResizeObserver(() => setBodyHeight(body.offsetHeight));
    observer.observe(body);
    return () => observer.disconnect();
  }, []);

  return (
    <li className="border-b border-primary-foreground last:border-b-0">
      <h3>
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={`relative flex w-full items-center justify-between gap-6 px-5 py-3 text-left md:px-8 md:py-6 ${typeClass("display")}`}
          style={titleScale}
        >
          {/* The semibold copy holds the width, so opening never shifts the row. */}
          <span className="inline-grid">
            <span
              className="col-start-1 row-start-1 transition-[font-variation-settings] duration-80"
              style={{ fontVariationSettings: open ? fontWeights.semibold : fontWeights.normal }}
            >
              {title}
            </span>
            <span aria-hidden className="invisible col-start-1 row-start-1" style={{ fontVariationSettings: fontWeights.semibold }}>
              {title}
            </span>
          </span>
          <motion.span
            aria-hidden
            className="flex shrink-0"
            initial={false}
            animate={{ rotate: open ? 45 : 0 }}
            transition={open ? spring.fast : spring.fast.exit}
          >
            <PlusIcon size={20} weight="light" />
          </motion.span>
        </button>
      </h3>
      {/* Always mounted, and grown to its body's measured height rather than
          to "auto": Motion resolves "auto" by measuring, and puts the page
          back where it was afterwards, which halts a smooth scroll mid-way. */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        inert={!open}
        className="overflow-clip"
        initial={false}
        animate={{ height: open ? bodyHeight : 0, opacity: open ? 1 : 0 }}
        transition={
          open
            ? { height: reduce ? { duration: 0 } : spring.moderate, opacity: spring.fast }
            : { height: reduce ? { duration: 0 } : spring.moderate.exit, opacity: spring.fast.exit }
        }
      >
        <p ref={bodyRef} className={`max-w-[46ch] px-5 pb-4 md:px-8 md:pb-8 ${typeClass("title")}`}>
          {body}
        </p>
      </motion.div>
    </li>
  );
}
