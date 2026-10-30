export const home = {
  /** The panels, left to right, as the header's section nav lists them. */
  sections: [
    { id: "studio", label: "Studio" },
    { id: "approach", label: "Approach" },
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "technology", label: "Technology" },
    { id: "clients", label: "Clients" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    headline: "Software that ships. Systems that stay up.",
    intro:
      "A senior software studio. We design, build and run web platforms, AI products and the infrastructure under them, and we stay on long after launch.",
    /**
     * Beside the game: how the work is done, where the services panel says
     * what it is. `visual` names the MagicBento artwork each card plays; each
     * one hides itself when its card gets too short to show it.
     */
    promises: [
      {
        title: "One senior team",
        detail: "The people you meet are the people who write the code.",
        visual: "integration",
      },
      { title: "No lock-in", detail: "Open source, in your repository, on your servers.", visual: "security" },
      { title: "Here after launch", detail: "We watch, fix and improve what we ship.", visual: "analytics" },
    ],
  },
  approach: {
    headline: ["Built", "to", "last"],
    subheading: "Where ambition meets engineering",
    credits: [
      { role: "Planned with", by: "Your team" },
      { role: "Designed by", by: "Product designers" },
      { role: "Built by", by: "Senior engineers" },
      { role: "Run by", by: "The people who built it" },
    ],
    essay: [
      {
        text: "Most software doesn't fail at launch. It fails a year later, when the team that built it has moved on, the shortcuts come due, and nobody quite remembers why it works the way it does.",
      },
      {
        text: "The products that last are built differently. Small senior teams, a clear point of view, and the discipline to cut scope before cutting corners.",
      },
      {
        text: "We design, build and run web platforms, AI products and the systems behind them, for founders shipping a first version and companies replacing a tenth.",
      },
      { text: "And when it goes live?\nIt stays up.", strong: true },
      {
        text: "We stay on after launch: watching, fixing, improving. The people who wrote the code are the ones you call.",
      },
      { text: "This is the work that keeps running.", strong: true },
    ],
  },
  services: {
    heading: "Your stack, your call.",
    intro:
      "Everything is custom-built on open source technology, with no proprietary platform and no subscription. The code, documentation and access are handed over at delivery.",
    /** Listed in the order their blocks land on the stack. */
    items: [
      {
        id: "agents",
        title: "Agentic AI",
        body: "A first agent in production within weeks, on your data, hosted on your own servers with open models. Company memory, documentation search, KPI tracking.",
      },
      {
        id: "commerce",
        title: "Ecommerce",
        body: "A headless Medusa store, ready for the age of AI. Open source, with no subscription, no commission and no limit on what you can change.",
      },
      {
        id: "platforms",
        title: "Web platforms",
        body: "Customer portals, dashboards and internal tools, designed and built by one senior team and live in weeks rather than quarters.",
      },
      {
        id: "infrastructure",
        title: "Infrastructure",
        body: "Your stack on your own servers or cloud, monitored around the clock, patched and backed up by the people who built it.",
      },
    ],
  },
  process: {
    heading: "Built and hosted your way.",
    intro:
      "Handed over with everything you need to carry on without us. Nothing gets built until the scope is agreed, nothing wraps up until your team can run it, and in between you see it working every week.",
    /** In the order they happen, left to right. */
    steps: [
      {
        id: "scoping",
        title: "Scoping",
        body: "Scope, priorities and deliverables agreed with you before the first line of code.",
      },
      {
        id: "development",
        title: "Development",
        body: "Built on open source technology, with a working demo at the end of every week.",
      },
      {
        id: "delivery",
        title: "Delivery",
        body: "The code, documentation and access are yours, with no dependency on our tools.",
      },
      {
        id: "training",
        title: "Training",
        body: "Your team learns to run and evolve the product, with or without us.",
      },
    ],
  },
  technology: {
    heading: "Web and mobile, end to end.",
    intro:
      "Proven, widely used tools your team can hire for and keep building on. One senior team covers the browser, the phone and the servers behind both.",
    /** Each group runs along its own band; the bands weave together and travel opposite ways. */
    groups: [
      {
        id: "web",
        label: "Web",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "Vue",
          "Svelte",
          "Tailwind CSS",
          "GraphQL",
          "PostgreSQL",
          "Medusa",
        ],
      },
      {
        id: "mobile",
        label: "Mobile",
        items: ["React Native", "Expo", "Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "Flutter"],
      },
    ],
  },
  testimonials: {
    heading: "What our clients say.",
    intro: "Founders who trusted us with their product, and came back with the next one. They tell it best.",
    carousel: "carousel",
    slide: "testimonial",
    of: "of",
    previous: "Previous testimonial",
    next: "Next testimonial",
    picker: "Choose a testimonial",
    join: "Join our clients",
    /** `id` picks the drawing beside the quote. */
    items: [
      {
        id: "arctic-shelf",
        name: "Dawson Norrish",
        role: "Founder",
        company: "Arctic Shelf",
        quote:
          "Jatin and Ravi were great. They were always available for phone calls and were always willing to try new things. Very knowledgeable in IoT products and AWS integration. They were also always willing to try new things and deliver what we were asking for. Very happy.",
      },
      {
        id: "bolotalk",
        name: "Mohhamamd Asraf",
        role: "Founder",
        company: "BoloTalk",
        quote:
          "Rapidsofts team has done many projects for me, and they never failed to deliver a world class product on time. Select him to do your work… you will never regret it.",
      },
      {
        id: "mapbuzz",
        name: "Jay Amlesh",
        role: "Founder",
        company: "Mapbuzz",
        quote:
          "Job well done. They have delivered the product as I wished and I recommend them to other clients. Thank you guys and I look forward to doing more tasks with you.",
      },
      {
        id: "sync-bus-lines",
        name: "Sondra Conner",
        role: "CEO",
        company: "Sync Bus Lines",
        quote:
          "Rapidsofts team are by far the best team I've worked with in the past 5 years. Patient, understanding, creative and always ready to help.",
      },
      {
        id: "mastbit",
        name: "Jakub Fundowicz",
        role: "CEO",
        company: "MastBit",
        quote:
          "I have been a satisfied client of Rapidsofts. I am impressed with their quality work and responsiveness.",
      },
    ],
  },
  contact: {
    heading: "Got something worth building?",
    body: "Tell us what you're making and where it needs to go. We'll come back with a plan and the team to ship it.",
  },
} as const;
