import type { Icon } from "@phosphor-icons/react";
import { isoMatrix, project } from "./iso-geometry";

/** Depth of the extrusion, in the face's 0–100 units. */
const depth = 12;
// Filled copies stacked between the top and bottom faces make the solid side
// walls; this far apart they never leave a gap.
const layerStep = 1.5;
const layers = Array.from({ length: Math.ceil(depth / layerStep) + 1 }, (_, i) => Math.min(depth, i * layerStep)).reverse();

const [left] = project(0, 100);
const [right] = project(100, 0);
const viewBox = [left - 2, -2, right - left + 4, project(100, 100)[1] + depth + 4].join(" ");

/**
 * A Phosphor glyph laid flat in isometric view and extruded into a slab: its
 * outline drawn on the top face and again along the bottom edge, with the
 * walls in between filled with the page colour so lines behind them hide.
 */
export function IsoGlyph({ icon: Glyph, className }: { icon: Icon; className?: string }) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden
      className={`overflow-visible text-primary [&_path]:[vector-effect:non-scaling-stroke] ${className ?? ""}`}
    >
      {layers.map((offset) => {
        const edge = offset === depth || offset === 0;
        return (
          <g key={offset} transform={`translate(0 ${offset}) ${isoMatrix}`}>
            <Glyph
              x={0}
              y={0}
              size={100}
              weight="bold"
              className="fill-background"
              stroke={edge ? "currentColor" : "none"}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
