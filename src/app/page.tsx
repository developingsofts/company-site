import { home } from "@/content/home";
import { ApproachPanel, ContactPanel, Hero, HorizontalChapter, ProcessPanel, ServicesPanel } from "@/features/home";
import { SiteHeader, SiteMenu } from "@/features/site";

// The page scrolls down. Its first chapter pins and reads sideways (hero,
// approach, then services, which holds still while its blocks stack); once
// that runs out, the page carries on downwards through process to contact.
// No reveal-landing: the game playing out is the page's entrance.
export default function HomePage() {
  return (
    <>
      <SiteMenu>
        <SiteHeader sections={home.sections} />
      </SiteMenu>
      <main>
        <HorizontalChapter>
          <Hero />
          <ApproachPanel />
          <ServicesPanel />
        </HorizontalChapter>
        <ProcessPanel />
        <ContactPanel />
      </main>
    </>
  );
}
