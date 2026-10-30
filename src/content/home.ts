export const home = {
  /** The panels, left to right, as the header's section nav lists them. */
  sections: [
    { id: "studio", label: "Studio" },
    { id: "approach", label: "Approach" },
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
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
  contact: {
    heading: "Got something worth building?",
    body: "Tell us what you're making and where it needs to go. We'll come back with a plan and the team to ship it.",
  },
} as const;
