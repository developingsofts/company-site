import type { Icon } from "@phosphor-icons/react";

/** A Phosphor icon placed on a block's top face, filled only: the face's art strokes everything else. */
export function FaceIcon({ icon: Glyph, x, y, size }: { icon: Icon; x: number; y: number; size: number }) {
  return <Glyph x={x} y={y} size={size} weight="light" stroke="none" />;
}
