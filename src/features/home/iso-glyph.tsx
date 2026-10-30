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
/** The glyph's canvas in face units: x, y, width, height. */
export const glyphViewBox = [left - 2, -2, right - left + 4, project(100, 100)[1] + depth + 4] as const;
const [centreX, centreY] = project(50, 50);
/** Where the centre of the glyph's bottom face lands on that canvas. */
export const glyphBase = [centreX, centreY + depth] as const;
const viewBox = glyphViewBox.join(" ");

interface IsoGlyphProps {
  icon: Icon;
  className?: string;
  /** Drawn on a primary-coloured surface: lines in its foreground colour, walls in the primary. */
  inverse?: boolean;
}

/**
 * A Phosphor glyph laid flat in isometric view and extruded into a slab: its
 * outline drawn on the top face and again along the bottom edge, with the
 * walls in between filled with the surface colour so lines behind them hide.
 */
export function IsoGlyph({ icon: Glyph, className, inverse = false }: IsoGlyphProps) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden
      className={`overflow-visible ${inverse ? "text-primary-foreground" : "text-primary"} [&_path]:[vector-effect:non-scaling-stroke] ${className ?? ""}`}
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
              className={inverse ? "fill-primary" : "fill-background"}
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
