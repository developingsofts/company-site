"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { home } from "@/content/home";
import { useIcons } from "@/lib/icon-context";
import { spring } from "@/lib/springs";

interface CarouselControlsProps {
  /** One name per slide, for its button in the picker. */
  names: readonly string[];
  index: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const nudge = (x: number) => ({ rest: { x: 0 }, hover: { x } });

/** A square per slide to jump to it, and arrows to step either way. */
export function CarouselControls({ names, index, onSelect, onPrevious, onNext }: CarouselControlsProps) {
  const { picker, previous, next } = home.testimonials;
  const icons = useIcons();
  const ArrowLeft = icons["arrow-left"];
  const ArrowRight = icons["arrow-right"];
  const markerId = useId();

  const arrows = [
    { label: previous, Icon: ArrowLeft, onClick: onPrevious, shift: -3 },
    { label: next, Icon: ArrowRight, onClick: onNext, shift: 3 },
  ];

  return (
    <div className="flex items-center justify-between gap-6">
      <div role="group" aria-label={picker} className="-mx-2 flex">
        {names.map((name, i) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            aria-current={i === index ? "true" : undefined}
            onClick={() => onSelect(i)}
            className="flex size-7 items-center justify-center"
          >
            <span className="relative size-2 border border-primary">
              {i === index && (
                <motion.span layoutId={markerId} transition={spring.moderate} className="absolute -inset-px bg-primary" />
              )}
            </span>
          </button>
        ))}
      </div>
      <div className="flex">
        {arrows.map(({ label, Icon, onClick, shift }, i) => (
          <motion.button
            key={label}
            type="button"
            aria-label={label}
            onClick={onClick}
            initial="rest"
            whileHover="hover"
            whileFocus="hover"
            className={`flex size-9 items-center justify-center border border-primary text-primary ${i > 0 ? "-ml-px" : ""}`}
          >
            <motion.span variants={nudge(shift)} transition={spring.fast}>
              <Icon size={16} strokeWidth={1.5} />
            </motion.span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
