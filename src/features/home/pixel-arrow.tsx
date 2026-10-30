const pixels = [
  "......#....",
  "......##...",
  "......###..",
  "##########.",
  "###########",
  "##########.",
  "......###..",
  "......##...",
  "......#....",
];

/** A right-pointing arrow drawn on the same square grid as the board. */
export function PixelArrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${pixels[0].length} ${pixels.length}`}
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {pixels.flatMap((row, y) =>
        [...row].map((p, x) => (p === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)),
      )}
    </svg>
  );
}
