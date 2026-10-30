import type { CSSProperties } from "react";
import MagicBento from "@/components/MagicBento";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { HoverReveal } from "@/features/site";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { PixelArrow } from "./pixel-arrow";

// The first promise spans the bento's width; the other two share a row.
const promises = home.hero.promises.map(({ title, detail, visual }, i) => ({
  title,
  description: detail,
  visual,
  colSpan: i === 0 ? 2 : 1,
}));

// Rows share the column's height instead of MagicBento's fixed row height,
// and its ink follows the theme instead of its own greys. The rest turns its
// white cards into liquid glass: a thin, uneven sheen over what the card
// blurs behind it, a bright rim catching light along the top and a soft
// claret shadow under it. The inner tiles get the same treatment, lighter.
const bentoStyle = {
  gridAutoRows: "minmax(0, 1fr)",
  "--mb-ink": "var(--foreground)",
  "--mb-muted": "var(--muted-foreground)",
  "--mb-surface":
    "linear-gradient(150deg, rgb(255 255 255 / 0.62) 0%, rgb(255 255 255 / 0.22) 48%, rgb(255 255 255 / 0.38) 100%)",
  "--mb-edge": "rgb(255 255 255 / 0.7)",
  "--mb-highlight": "rgb(255 255 255 / 0.95)",
  "--mb-shadow":
    "inset 0 -1px 0 color-mix(in oklab, var(--foreground) 8%, transparent), 0 20px 40px -26px color-mix(in oklab, var(--primary) 55%, transparent), 0 8px 16px -12px color-mix(in oklab, var(--foreground) 22%, transparent)",
  "--mb-tile": "linear-gradient(180deg, rgb(255 255 255 / 0.72), rgb(255 255 255 / 0.32))",
  "--mb-tile-edge": "rgb(255 255 255 / 0.85)",
  "--mb-well": "rgb(255 255 255 / 0.25)",
} as CSSProperties;

/**
 * The column beside the game: how the studio works, as animated cards, then
 * the way in. On a phone only the way in stays, as a strip under the game, so
 * the board keeps the screen.
 */
export function HeroAside() {
  return (
    <div data-hero-aside className="flex flex-col border-t md:border-t-0 md:border-l">
      {/* Wrapped because MagicBento joins class names without merging, so a
          `hidden` passed in would race its own `grid`. The accent repeats
          --primary: MagicBento reads hex or "r, g, b", not CSS variables.
          Glass needs something behind it to bend, so two soft claret pools
          sit under the cards, and each card (`.magic-bento > cell > card`)
          blurs and saturates them. */}
      <div className="relative hidden min-h-0 flex-1 p-6 md:flex [&_.magic-bento>*>*]:backdrop-blur-xl [&_.magic-bento>*>*]:backdrop-saturate-150">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_40%_at_22%_18%,color-mix(in_oklab,var(--primary)_30%,transparent),transparent),radial-gradient(50%_38%_at_82%_78%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]"
        />
        <MagicBento items={promises} columns={2} gap={12} radius={16} theme="light" glowColor="#97242d" style={bentoStyle} />
      </div>
      <div className="mt-auto flex items-center justify-between gap-6 px-6 py-4 md:pt-0 md:pb-6">
        <PixelArrow className="w-11 text-primary" />
        <a
          href={site.cta.href}
          className={`inline-flex h-9 items-center bg-primary px-4 font-mono text-primary-foreground ${typeClass("body")}`}
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          <HoverReveal>{site.cta.label}</HoverReveal>
        </a>
      </div>
    </div>
  );
}
