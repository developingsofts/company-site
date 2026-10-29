import { site } from "@/content/site";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";

export function Hero() {
  return (
    <section className="flex flex-col gap-3 py-24">
      <h1 className={typeClass("display")} style={{ fontVariationSettings: fontWeights.bold }}>
        {site.tagline}
      </h1>
      <p className={`max-w-xl text-muted-foreground ${typeClass("body")}`}>{site.description}</p>
    </section>
  );
}
