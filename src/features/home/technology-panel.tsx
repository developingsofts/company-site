import type { CSSProperties } from "react";
import TextLoop from "@/components/TextLoop";
import { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { waveTrack } from "./wave-track";

const headingScale = {
  "--fs-display": "clamp(2rem, 4.5vw, 3.5rem)",
  "--lh-display": "1.05",
} as CSSProperties;

// The loop re-lays every letter along the curve each frame, so a track only
// runs a little past the canvas. It also stretches or squeezes the letters
// until a whole number of copies fills the track, so each track's length in
// half waves is picked to hold close to whole copies of its list: two of the
// web list on seven, two of the mobile list on five, within a few percent.
// Pick again if a list grows or shrinks a lot.
const bands = [
  { track: waveTrack(170, -3, 4), direction: "forward", ribbon: "var(--primary)", ink: "var(--primary-foreground)" },
  { track: waveTrack(-170, -2, 3), direction: "reverse", ribbon: "var(--foreground)", ink: "var(--background)" },
] as const;

// Both bands lean the same way, so they stay woven instead of forming an X.
const tilt = -4;

/** The web and mobile tools, on two mirrored waves that meet every half wave and run opposite ways. */
export function TechnologyPanel() {
  const { heading, intro, groups } = home.technology;
  return (
    <section
      id="technology"
      aria-labelledby="technology-heading"
      className="overflow-x-clip border-t pt-16 pb-20 md:pt-24 md:pb-28"
    >
      <div className="flex flex-col gap-6 px-6 md:flex-row md:justify-between md:gap-16 md:px-14">
        <h2
          id="technology-heading"
          className={`max-w-[14ch] text-balance ${typeClass("display")}`}
          style={{ ...headingScale, fontVariationSettings: fontWeights.semibold }}
        >
          {heading}
        </h2>
        <p className={`max-w-md text-muted-foreground ${typeClass("title")}`}>{intro}</p>
      </div>
      {groups.map((group) => (
        <div key={group.id} className="sr-only">
          <h3>{group.label}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
      {/* The loop draws on a fixed 1200×520 canvas with the bands across its
          middle; the negative margins, a share of the width like the canvas
          height, crop the empty rows above and below. Phones get a wider
          canvas, cropped at the sides too, so the words stay legible.
          flow-root keeps the margins inside the clip rather than collapsing
          through it. geometricPrecision turns off hinting, which otherwise
          snaps each moving letter to the pixel grid and makes the text shimmer. */}
      <div aria-hidden="true" className="mt-10 flow-root overflow-clip md:mt-16">
        <div
          className="-mx-[30%] -my-[13.5%] grid w-[160%] [text-rendering:geometricPrecision] md:mx-0 md:-my-[8.5%] md:w-full"
          style={{ fontVariationSettings: fontWeights.bold }}
        >
          {groups.map((group, i) => (
            <TextLoop
              key={group.id}
              className="[grid-area:1/1]"
              text={group.items.join(" • ")}
              separator="•"
              path={bands[i].track}
              tilt={tilt}
              direction={bands[i].direction}
              speed={60}
              fontWeight="inherit"
              letterSpacing={0}
              uppercase={false}
              ribbonColor={bands[i].ribbon}
              color={bands[i].ink}
              // The bands overlap, so only the top one would ever see the pointer.
              pauseOnHover={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
