import { home } from "@/content/home";
import { site } from "@/content/site";
import { HoverReveal } from "@/features/site";
import { fontWeights } from "@/lib/font-weight";
import { typeClass } from "@/lib/type-scale";

/** The closing screen, reached by scrolling down once the sideways chapter ends. */
export function ContactPanel() {
  const { heading, body } = home.contact;
  return (
    <section id="contact" aria-labelledby="contact-heading" className="flex min-h-svh flex-col border-t">
      <div className="flex flex-col gap-6 border-b px-6 pt-16 pb-12 md:flex-row md:justify-between md:gap-16 md:px-14 md:pt-24 md:pb-16">
        <h2
          id="contact-heading"
          className={`max-w-[16ch] text-balance ${typeClass("display")}`}
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          {heading}
        </h2>
        <p className={`max-w-sm text-muted-foreground ${typeClass("title")}`}>{body}</p>
      </div>
      <div className="flex flex-1 items-end justify-end px-6 py-10 md:px-14">
        <a
          href={`mailto:${site.email}`}
          className={`inline-flex h-9 items-center bg-primary px-4 font-mono text-primary-foreground ${typeClass("body")}`}
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          <HoverReveal>{site.email}</HoverReveal>
        </a>
      </div>
    </section>
  );
}
