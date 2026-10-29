import { Hero } from "@/features/home";
import { SiteFooter, SiteHeader } from "@/features/site";

// Chrome (header, footer) stays still outside the reveal container. Inside
// .reveal-landing the first child is the hero and plays on load; every later
// section rises with the scroll.
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="reveal-landing mx-auto w-full max-w-5xl flex-1 px-4">
        <Hero />
      </main>
      <SiteFooter />
    </>
  );
}
