import Link from "next/link";
import { site } from "@/content/site";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";
import { ElasticLine } from "./elastic-line";
import { HoverReveal } from "./hover-reveal";
import { SectionNav } from "./section-nav";
import type { SpySection } from "./use-scroll-spy";

export function SiteHeader({ sections }: { sections: readonly SpySection[] }) {
  return (
    <header className="relative flex h-14 items-stretch bg-background">
      {/* Its bottom edge: a strip centred on the edge, so the line can be
          pulled either way. */}
      <ElasticLine className="absolute inset-x-0 -bottom-6 h-12 w-full text-border" />
      {/* The menu toggle sits over this cell. */}
      <div aria-hidden className="w-14 shrink-0 border-r" />
      <Link
        href="/"
        className={`flex shrink-0 items-center border-r px-4 md:px-8 ${typeClass("title")}`}
        style={{ fontVariationSettings: fontWeights.semibold }}
      >
        <HoverReveal>{site.name}</HoverReveal>
      </Link>
      <div className="flex min-w-0 items-center border-r px-2 md:px-3">
        <SectionNav sections={sections} label={site.navLabel} />
      </div>
      <a
        href={site.cta.href}
        className={`ml-auto flex shrink-0 items-center bg-primary px-4 font-mono text-primary-foreground md:px-6 ${typeClass("body")}`}
      >
        <HoverReveal>{site.cta.label}</HoverReveal>
      </a>
    </header>
  );
}
