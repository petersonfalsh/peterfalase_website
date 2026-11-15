// Review these facts against the public resume before publishing changes.
export const careerTimeline = [
  {
    year: "2024 — now",
    role: "IT & Digital Operations Lead",
    company: "Monoliza Sport & Recreational Center",
    tag: "OPERATIONS / SYSTEMS",
    body: "Keeping workplace technology dependable while turning booking, membership, invoicing and tournament administration into clearer, repeatable digital workflows.",
    resumeDetails: "Day-to-day IT operations, workplace technology, printers, network connectivity, hardware troubleshooting, membership registration, facility booking, invoicing, tournament administration, operational reporting, IT assets, procurement, repairs, vendor coordination, SOP-style documentation and executive reporting.",
  },
  {
    year: "2024 — now",
    role: "IT & Project Coordination Officer",
    company: "Threemplus Integrated Enterprises Ltd",
    tag: "PROJECTS / DELIVERY",
    body: "Bringing structure to construction and infrastructure work through document control, reporting systems, equipment tracking and cross-team coordination.",
    resumeDetails: "Digital reporting, document control, construction and infrastructure-related coordination, technical, bid, proposal and compliance documentation, outsourced work tracking, equipment records, IT procurement, inventory reviews, digital asset organization and website modernization.",
  },
  {
    year: "2021 — 2023",
    role: "Web Developer / Project Lead",
    company: "Freelance & Contract Roles",
    tag: "BUILD / SHIP",
    body: "Built responsive websites, web applications, dashboards and database-backed features, taking small technical projects from scope to delivery.",
    resumeDetails: "Built responsive websites and web applications, front-end interfaces, database-backed features, authentication and management dashboards; coordinated scope, timelines, client communication and delivery.",
  },
  {
    year: "2018 — 2020",
    role: "Administrative Coordinator / Supervisor",
    company: "Network Energy Development Company",
    tag: "PROCESS / PEOPLE",
    body: "Supervised day-to-day operations, staff allocation, invoicing, documentation and recurring reporting with an eye for consistent follow-through.",
    resumeDetails: "Supervised daily operations, staff task allocation, invoicing, documentation and recurring reports.",
  },
  {
    year: "2017",
    role: "Utility & Technical Operations Officer",
    company: "Green Acres Boarding School",
    tag: "INFRASTRUCTURE",
    body: "Supported generator, solar and electrical infrastructure operations through maintenance scheduling, repair coordination and timely escalation.",
    resumeDetails: "Supported generator, solar and electrical infrastructure operations, maintenance scheduling and repair coordination.",
  },
];

export const careerFacts = [
  "Name: Peter Falase. Based in Abuja, Nigeria.",
  "Positioning: IT and digital operations professional focused on systems, automation and technical project coordination.",
  "Summary: Technology-focused professional supporting business operations, IT infrastructure, workflow digitization, technical documentation and project coordination across sports, construction and corporate environments.",
  "Technical skills: JavaScript, HTML, CSS, Next.js, PostgreSQL, Supabase Auth & Database, Git, GitHub, Microsoft Office and Google Workspace.",
  "Current professional development: AI/LLM engineering, RAG concepts, AI-assisted development, cloud architecture, DevOps fundamentals, Docker/Linux concepts, system design and business process automation.",
  "Education: B.Tech (Hons) in Engineering from Ladoke Akintola University of Technology (LAUTECH).",
  "Professional memberships: Graduate Member of the Nigerian Society of Engineers (NSE) and Graduate Member of the Nigerian Institution of Mechanical Engineers (NiMechE).",
  "Contact: pafalase@gmail.com and +234 802 908 5195.",
  "Portfolio: A portfolio of systems, interfaces and operational improvements is in progress; do not claim specific published case studies.",
];

export function buildCareerProfile() {
  const roles = careerTimeline.map(({ year, role, company, resumeDetails }) => `${year}: ${role} at ${company}. ${resumeDetails}`);
  return [...careerFacts, ...roles].map((fact) => `- ${fact}`).join("\n");
}
