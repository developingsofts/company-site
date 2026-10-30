import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { Arrival } from "./arrival";
import { CutReveal } from "./cut-reveal";
import { TextSwarm } from "./text-swarm";

// A poster headline: one word a line, as tall as the screen allows while the
// subheading and credits still fit beneath it.
const posterScale = {
  "--fs-display": "clamp(3rem, min(15svh, 14vw), 11rem)",
  "--lh-display": "0.86",
} as CSSProperties;

const subheadingScale = {
  "--fs-display": "clamp(1.75rem, 4.5svh, 2.75rem)",
  "--lh-display": "1.05",
} as CSSProperties;

// Seconds after the page arrives that each part starts rising: the headline
// leads, the essay follows a beat later on the right, the credits close.
const cue = { headline: 0, subheading: 0.25, essay: 0.2, credits: 0.45 };

export function ApproachPanel() {
  const { headline, subheading, credits, essay } = home.approach;
  return (
    <section id="approach" aria-labelledby="approach-heading" className="row-span-2 border-l">
      <Arrival className="h-full">
        <TextSwarm>
          <div className="flex h-full">
            <div className="flex w-[min(100cqw,max(36rem,46cqw))] flex-col justify-between gap-10 px-6 pt-16 pb-10 md:px-14 md:pt-14 md:pb-12">
              <div className="flex flex-col gap-8">
                {/* Capitals here only: the poster line is the one place the
                    page shouts. */}
                <h2
                  id="approach-heading"
                  className={`uppercase ${typeClass("display")}`}
                  style={{ ...posterScale, fontVariationSettings: fontWeights.bold }}
                >
                  <CutReveal delay={cue.headline} stagger={0.08} wordClassName="block">
                    {headline.join(" ")}
                  </CutReveal>
                </h2>
                <p
                  className={`max-w-[14ch] ${typeClass("display")}`}
                  style={{ ...subheadingScale, fontVariationSettings: fontWeights.bold }}
                >
                  <CutReveal delay={cue.subheading} stagger={0.03}>
                    {subheading}
                  </CutReveal>
                </p>
              </div>
              <dl className="grid gap-3">
                {credits.map(({ role, by }, i) => (
                  <div key={role}>
                    <dt className={`font-mono ${typeClass("subtitle")}`} style={{ fontVariationSettings: fontWeights.semibold }}>
                      <CutReveal delay={cue.credits + i * 0.06}>{role}</CutReveal>
                    </dt>
                    <dd className={`text-muted-foreground ${typeClass("subtitle")}`}>
                      <CutReveal delay={cue.credits + i * 0.06 + 0.03}>{by}</CutReveal>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex w-[min(100cqw,30rem)] flex-col justify-center gap-5 px-6 py-12 md:pr-14 md:pl-6">
              {essay.map((paragraph, i) => (
                <p
                  key={paragraph.text}
                  className={typeClass("title")}
                  style={{ fontVariationSettings: "strong" in paragraph ? fontWeights.semibold : fontWeights.normal }}
                >
                  <CutReveal delay={cue.essay + i * 0.1} stagger={0.008}>
                    {paragraph.text}
                  </CutReveal>
                </p>
              ))}
            </div>
          </div>
        </TextSwarm>
      </Arrival>
    </section>
  );
}
