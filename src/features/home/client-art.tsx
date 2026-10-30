"use client";

import type { Icon } from "@phosphor-icons/react";
import { BusIcon, CellTowerIcon, ChatsCircleIcon, MapPinIcon, SnowflakeIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { spring } from "@/lib/springs";
import { FaceIcon } from "./face-icon";
import { IsoBlock } from "./iso-block";
import { blockViewBox } from "./iso-geometry";
import { IsoGlyph, glyphBase, glyphViewBox } from "./iso-glyph";

type ClientId = (typeof home.testimonials.items)[number]["id"];

const icons: Record<ClientId, Icon> = {
  "arctic-shelf": SnowflakeIcon,
  bolotalk: ChatsCircleIcon,
  mapbuzz: MapPinIcon,
  "sync-bus-lines": BusIcon,
  mastbit: CellTowerIcon,
};

// Everything below is in the slab's units. The glyph is drawn at `scale` of
// the slab's size and hovers `lift` above the middle of its top face; the
// frame is the box around both, so the two can be placed in it by percentage.
const scale = 0.62;
const lift = 20;
const [bx, by, bw, bh] = blockViewBox;
const [gx, gy, gw, gh] = glyphViewBox;
const glyphLeft = (glyphBase[0] - gx) * -scale;
const glyphTop = 50 - lift - (glyphBase[1] - gy) * scale;
const frameTop = Math.min(by, glyphTop);
const frameHeight = by + bh - frameTop;

const pct = (n: number) => `${n * 100}%`;
const frameStyle = { aspectRatio: `${bw} / ${frameHeight}` } satisfies CSSProperties;
const slabStyle = { top: pct((by - frameTop) / frameHeight), height: pct(bh / frameHeight) } satisfies CSSProperties;
const glyphStyle = {
  left: pct((glyphLeft - bx) / bw),
  top: pct((glyphTop - frameTop) / frameHeight),
  width: pct((gw * scale) / bw),
  height: pct((gh * scale) / frameHeight),
} satisfies CSSProperties;

// Footprint of the glyph on the face, in the face's 0–100 units.
const footprint = { at: 50 - 50 * scale, size: 100 * scale };

const backdrop = {
  backgroundImage:
    "repeating-linear-gradient(30deg, var(--border) 0 1px, transparent 1px 28px), repeating-linear-gradient(150deg, var(--border) 0 1px, transparent 1px 28px)",
  maskImage: "radial-gradient(closest-side, black 40%, transparent)",
} satisfies CSSProperties;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The drawing beside a testimonial: the client's mark extruded in isometric
 * view, hovering over a slab whose top face carries its shadow and the
 * carousel's count. A new mark drops in from above as the slide changes.
 */
export function ClientArt({ index }: { index: number }) {
  const { items } = home.testimonials;
  const client = items[index];
  const solid = useMotionValue(1);
  const none = useMotionValue(0);

  return (
    <div aria-hidden className="relative flex size-full items-center justify-center overflow-clip px-10 py-12">
      <div className="absolute inset-0" style={backdrop} />
      <div className="relative w-full max-w-56 md:max-w-72" style={frameStyle}>
        <div className="absolute inset-x-0" style={slabStyle}>
          <IsoBlock
            fill={solid}
            ink={solid}
            ghost={none}
            art={
              <AnimatePresence initial={false}>
                <motion.g
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: spring.slow }}
                  exit={{ opacity: 0, transition: spring.slow.exit }}
                >
                  <g className="fill-current opacity-15">
                    <FaceIcon icon={icons[client.id]} x={footprint.at} y={footprint.at} size={footprint.size} />
                  </g>
                  <text x={8} y={94} className="fill-current stroke-none font-mono" fontSize={11}>
                    {pad(index + 1)}
                    <tspan fontSize={6} dx={2}>
                      / {pad(items.length)}
                    </tspan>
                  </text>
                </motion.g>
              </AnimatePresence>
            }
          />
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={client.id}
            className="absolute"
            style={glyphStyle}
            initial={{ opacity: 0, y: "-30%" }}
            animate={{ opacity: 1, y: "0%", transition: spring.slow }}
            exit={{ opacity: 0, y: "-15%", transition: spring.slow.exit }}
          >
            <IsoGlyph icon={icons[client.id]} className="size-full" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
