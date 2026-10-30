"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ReactNode, useEffect, useId, useState } from "react";
import { spring } from "@/lib/springs";
import { MenuToggle } from "./menu-toggle";

/**
 * Keeps the header out of sight behind a toggle in the top-left corner. Open,
 * it slides down over the page instead of pushing it, so the panels below
 * keep their size, and stays put while the page scrolls.
 */
export function SiteMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <MenuToggle
        open={open}
        onToggle={() => setOpen((o) => !o)}
        controls={menuId}
        className="fixed top-2.5 left-2.5 z-30"
      />
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={menuId}
            className="fixed inset-x-0 top-0 z-20"
            initial={{ y: "-100%" }}
            animate={{ y: 0, transition: spring.moderate }}
            exit={{ y: "-100%", transition: spring.moderate.exit }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
