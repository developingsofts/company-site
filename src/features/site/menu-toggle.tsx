"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { site } from "@/content/site";
import { useSize } from "@/lib/size-context";
import { spring } from "@/lib/springs";
import { cn } from "@/lib/utils";

interface MenuToggleProps {
  open: boolean;
  onToggle: () => void;
  /** Id of the menu it shows and hides. */
  controls: string;
  className?: string;
}

/** Three upright bars that turn into a cross while the menu is open. */
export function MenuToggle({ open, onToggle, controls, className }: MenuToggleProps) {
  const size = useSize();
  const glyph = (shown: boolean) => ({ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.6 });
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? site.menu.close : site.menu.open}
      onClick={onToggle}
      className={cn("grid place-items-center hover:bg-hover", size.control, "aspect-square", className)}
    >
      {/* Both glyphs share one cell and crossfade, so the button never
          changes size. The list icon stands on end: the page reads sideways. */}
      <motion.span className="col-start-1 row-start-1" initial={false} animate={glyph(!open)} transition={spring.fast}>
        <ListIcon size={size.icon} weight="bold" className="rotate-90" />
      </motion.span>
      <motion.span className="col-start-1 row-start-1" initial={false} animate={glyph(open)} transition={spring.fast}>
        <XIcon size={size.icon} weight="bold" />
      </motion.span>
    </button>
  );
}
