// Professional summaries use owner-supplied facts. The projects array below remains teaching examples.
export const portfolio = {
  name: "Jorge Sanchez",
  role: "Business Systems Analyst + Systems Builder",
  intro:
    "I turn manual and disconnected business processes into practical systems, automations, applications, and integrations.",
  email: "", // Add your real address to enable the contact link.
  github: "",
};
export const projects = [
  {
    slug: "campus-compass",
    title: "Campus Compass",
    discipline: "UX research / Product design",
    image: "/styles/swiss.svg",
    imageAlt: "Swiss typographic study with black lettering and a red circle",
    summary: "Making the first week on campus a little less overwhelming.",
    problem:
      "New students need to find buildings and essential services while learning an unfamiliar campus.",
    process:
      "Start with interviews about the first-week experience. Map the most common tasks, sketch a location finder, then test the route instructions with classmates.",
    outcome:
      "This is a sample brief, not a completed study. Replace this section with your actual findings, screenshots, and measured outcomes.",
    reflection:
      "How would the experience work with limited connectivity or for someone using a screen reader?",
  },
  {
    slug: "independent-press",
    title: "Independent Press",
    discipline: "Visual identity / Front-end",
    image: "/styles/punk.svg",
    imageAlt: "DIY punk composition with cut-paper lettering",
    summary: "An expressive digital home for a student-run publication.",
    problem:
      "A campus publication wants its visual voice to stand out while keeping long articles easy to read.",
    process:
      "Define a typographic hierarchy, build a responsive article template, and compare an expressive cover with a calm reading view.",
    outcome:
      "Sample concept only. Add your own implemented pages and explain the decisions you tested.",
    reflection:
      "Where does expression help the story, and where does it get in the reader’s way?",
  },
  {
    slug: "everyday-objects",
    title: "Everyday Objects",
    discipline: "Creative coding / Design systems",
    image: "/styles/bauhaus.svg",
    imageAlt: "Bauhaus-inspired red circle, blue square, and yellow triangle",
    summary: "A small experiment in shape, rhythm, and reusable systems.",
    problem:
      "Can a limited set of geometric parts produce a flexible visual identity?",
    process:
      "Choose three shapes, two type sizes, and a restricted palette. Make a series of compositions, then turn repeated patterns into components.",
    outcome:
      "Sample exercise. Document your experiments and include the code that generates or displays them.",
    reflection: "Which constraints helped you create a more coherent system?",
  },
];

export const professionalProjects = [
  {
    slug: "freight-estimator",
    title: "Freight Estimator API",
    category: "Business logic / Integration",
    summary: "From SKU packaging to a shipping quote.",
    technology: "PHP 8.3 / MySQL / FedEx API",
    label: "Internal system",
    problem:
      "Shipping quotes need to account for SKU packaging configurations and mixed or multiple cartons.",
    system:
      "An API that calculates cartons and retrieves shipping rates using FedEx OAuth and Rates API, with US/Canada quoting, an admin tool, logging, testing, and security hardening.",
    role: "Sole developer at Peerless Umbrella. Coordinated with web development, CRM integration, and accounting.",
    status:
      "Built for internal use. Usage and performance metrics are not published.",
    evidence:
      "Company-owned work. Sanitized diagrams and written case-study material are pending review; proprietary code, pricing, and customer data are not shared.",
  },
  {
    slug: "prodtrack",
    title: "ProdTrack",
    category: "Production / Business applications",
    summary: "Connecting production activity with business data.",
    technology: "Power Apps / Power Automate / Dataverse",
    label: "Photo approval verified",
    problem:
      "Production work needs scanning, status tracking, and photo approval functionality.",
    system:
      "Power Apps Canvas functionality connected to Dataverse and Dynamics 365, with a two-flow Dataverse queue architecture.",
    role: "Built scanning, status, and photo approval functionality. Designed the queue architecture and diagnosed duplicate processing caused by trigger fan-out and non-atomic writes.",
    status:
      "Photo approval confirmed working. Daily adoption and usage metrics are not established.",
    evidence:
      "Internal work. Redacted screenshots and sanitized process diagrams are pending review.",
  },
  {
    slug: "printing-from-crm",
    title: "Printing from CRM",
    category: "Workflow / Process automation",
    summary: "Bringing production documents into the CRM workflow.",
    technology: "Dynamics 365 / Power Automate",
    label: "Deployment scope pending",
    problem: "Production document generation relied on the ERP workflow.",
    system:
      "Automation designed to generate production documents from CRM, with document generation, PDF merging, and a Business Process Flow including QA and rejection stages.",
    role: "Designed the automation and Business Process Flow; worked with document generation and PDF merging.",
    status:
      "Design and implementation work described here does not imply that unfinished portions were fully deployed.",
    evidence:
      "Internal work. Shareable artifacts and the precise deployment scope are pending confirmation.",
  },
  {
    slug: "resumebutler",
    title: "ResumeButler",
    category: "Independent / Application development",
    summary: "An independent application for AI-assisted resume tailoring.",
    technology: "Next.js / TypeScript / AI integration",
    label: "Live independent project",
    problem: "Tailoring a resume to a particular opportunity.",
    system:
      "An AI resume tailoring SaaS built with Next.js, TypeScript, Tailwind, Neon Postgres, Prisma, NextAuth, Claude API, Stripe sandbox, Sentry, PostHog, Resend, and Vercel.",
    role: "Solo founder and developer.",
    status:
      "Live application. Stripe is in sandbox mode. No users, revenue, or adoption metrics are claimed.",
    evidence:
      "Public demo destination and screenshots have not yet been supplied for this portfolio.",
  },
];

export const skillGroups = [
  {
    title: "Business systems",
    items: ["Power Apps", "Dynamics 365", "Dataverse", "Copilot Studio"],
  },
  {
    title: "Automation",
    items: ["Power Automate", "Python scripting", "Process workflows"],
  },
  {
    title: "Development",
    items: ["PHP", "React / Next.js", "TypeScript", "Git / GitHub"],
  },
  {
    title: "Data & integration",
    items: ["MySQL", "REST APIs / OAuth", "Power BI / DAX"],
  },
];
