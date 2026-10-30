import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { ElasticLine } from "@/features/site";
import { TetrisBoard } from "@/features/tetris";
import { typeClass } from "@/lib/type-scale";
import { HeroAside } from "./hero-aside";

// The poster headline keeps the display role but scales with the viewport,
// capped by height so the game below keeps most of the screen. It is set in
// Geist Pixel, drawn on the same square grid as the game, which comes in one
// weight only, so no weight is asked of it.
const posterScale = {
  "--fs-display": "clamp(2.5rem, min(6vw, 9svh), 5.5rem)",
  "--lh-display": "1",
} as CSSProperties;

export function Hero() {
  const { headline, intro } = home.hero;
  return (
    <section
      id="studio"
      className="row-span-2 grid w-[100cqw] grid-cols-1 grid-rows-subgrid md:grid-cols-[minmax(0,1fr)_clamp(18rem,32%,30rem)]"
    >
      {/* The band shares the body's columns, so the intro lines up with the
          column beside the game. */}
      <div className="relative col-span-full grid gap-6 px-6 pt-16 pb-8 md:grid-cols-subgrid md:gap-0 md:px-0 md:pt-14 md:pb-12">
        {/* The band's bottom edge, over the board: a strip centred on the
            edge so the line can be pulled into either side, painted above
            the board, which comes later and would cover its lower half. */}
        <ElasticLine className="absolute inset-x-0 -bottom-6 z-10 h-12 w-full text-border" />
        <h1 className={`font-pixel text-balance md:pr-10 md:pl-14 ${typeClass("display")}`} style={posterScale}>
          {headline}
        </h1>
        <p className={`max-w-sm text-muted-foreground md:px-10 md:pt-3 ${typeClass("title")}`}>{intro}</p>
      </div>
      <div className="col-span-full grid grid-rows-[minmax(0,1fr)_auto] md:grid-cols-subgrid md:grid-rows-1">
        <TetrisBoard />
        <HeroAside />
      </div>
    </section>
  );
}
