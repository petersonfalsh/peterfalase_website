"use client";

import DigitalTwinChat from "./components/DigitalTwinChat";

const ArrowUpRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 4v16m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotGrid = () => <span className="dot-grid" aria-hidden="true" />;

const timeline = [
  {
    year: "2024 — now",
    role: "IT & Digital Operations Lead",
    company: "Monoliza Sport & Recreational Center",
    tag: "OPERATIONS / SYSTEMS",
    body: "Keeping workplace technology dependable while turning booking, membership, invoicing and tournament administration into clearer, repeatable digital workflows.",
  },
  {
    year: "2024 — now",
    role: "IT & Project Coordination Officer",
    company: "Threemplus Integrated Enterprises Ltd",
    tag: "PROJECTS / DELIVERY",
    body: "Bringing structure to construction and infrastructure work through document control, reporting systems, equipment tracking and cross-team coordination.",
  },
  {
    year: "2021 — 2023",
    role: "Web Developer / Project Lead",
    company: "Freelance & Contract Roles",
    tag: "BUILD / SHIP",
    body: "Built responsive websites, web applications, dashboards and database-backed features, taking small technical projects from scope to delivery.",
  },
  {
    year: "2018 — 2020",
    role: "Administrative Coordinator / Supervisor",
    company: "Network Energy Development Company",
    tag: "PROCESS / PEOPLE",
    body: "Supervised day-to-day operations, staff allocation, invoicing, documentation and recurring reporting with an eye for consistent follow-through.",
  },
  {
    year: "2017",
    role: "Utility & Technical Operations Officer",
    company: "Green Acres Boarding School",
    tag: "INFRASTRUCTURE",
    body: "Supported generator, solar and electrical infrastructure operations through maintenance scheduling, repair coordination and timely escalation.",
  },
];

const capabilityCards = [
  {
    number: "01",
    title: "Operational continuity",
    body: "The everyday systems people depend on: workplace technology, assets, vendors, networks and the calm response when something breaks.",
    accent: "acid",
  },
  {
    number: "02",
    title: "Digital workflows",
    body: "Replacing ad-hoc manual work with structured flows, documentation and visibility that make good operations easier to repeat.",
    accent: "lavender",
  },
  {
    number: "03",
    title: "Web & internal tools",
    body: "Responsive interfaces, data-backed features and practical systems that translate business needs into something useful and usable.",
    accent: "orange",
  },
  {
    number: "04",
    title: "Future-facing systems",
    body: "Growing deeper into AI/LLM engineering, RAG, cloud architecture, DevOps fundamentals and business process automation.",
    accent: "blue",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Peter Falase home">
          <span className="brand-mark">PF</span>
          <span className="brand-name">Peter Falase<span className="brand-dot">.</span></span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#journey">Journey</a>
          <a href="#digital-twin">AI Twin</a>
          <a href="#portfolio">Portfolio</a>
        </nav>
        <a className="header-contact" href="mailto:pafalase@gmail.com">
          Let&apos;s talk <ArrowUpRight size={15} />
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-grid" aria-hidden="true"><DotGrid /></div>
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> IT &amp; DIGITAL OPERATIONS / ABUJA, NIGERIA</p>
          <h1>I make complex<br /><span className="outlined">operations</span> <em>feel simple.</em></h1>
          <p className="hero-intro">Technology-focused operator and builder helping teams move from scattered processes to systems that work — reliably, visibly and with a little more intent.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#journey">Explore the journey <ArrowUpRight /></a>
            <a className="button button-quiet" href="/Peter_Falase_Professional_Resume_2026.pdf" target="_blank" rel="noreferrer">View resume <ArrowUpRight /></a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Profile snapshot">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="portrait-card">
            <div className="portrait-top"><span>PF / 01</span><span>PROFILE SNAPSHOT</span></div>
            <div className="portrait-initials">PF<span>.</span></div>
            <div className="portrait-bottom"><span>Systems thinker</span><span>Builder at heart</span></div>
          </div>
          <div className="signal-card">
            <span className="signal-label">CURRENT SIGNAL</span>
            <strong>IT &amp; Digital<br />Operations Lead</strong>
            <span className="signal-company">MONOLIZA / ABUJA <span className="signal-live">LIVE</span></span>
          </div>
          <div className="hero-index">01 <span>/ 05</span></div>
        </div>
        <a className="scroll-cue" href="#about"><ArrowDown /> Scroll to explore</a>
      </section>

      <div className="ticker" aria-label="Areas of focus">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div className="ticker-group" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
              <span>Systems thinking</span><i>✳</i><span>Workflow design</span><i>✳</i><span>Technical coordination</span><i>✳</i><span>Web development</span><i>✳</i>
            </div>
          ))}
        </div>
      </div>

      <section className="about section-shell section-padding" id="about">
        <div className="section-kicker"><span>01</span><span>THE OPERATOR / THE BUILDER</span></div>
        <div className="about-layout">
          <div className="about-heading"><h2>Ops brain.<br /><span>Builder&apos;s hands.</span></h2></div>
          <div className="about-body">
            <p className="lead">I sit at the intersection of people, process and technology.</p>
            <p>My work is about translating operational needs into clear digital processes — from a smoother booking flow to a more dependable workplace, a better report or an internal tool that quietly gives a team its time back.</p>
            <p>With an engineering background and experience across sports, construction and corporate environments, I bring a practical view of how systems behave in the real world.</p>
            <div className="about-foot"><span>Based in Abuja, Nigeria</span><span className="foot-line" /><span>Working across the stack of operations</span></div>
          </div>
        </div>
        <div className="stats-row">
          <div className="stat"><strong>2017<span>→</span></strong><span>Career in operations begins</span></div>
          <div className="stat"><strong>05<span>+</span></strong><span>Roles across technical &amp; business ops</span></div>
          <div className="stat"><strong>02</strong><span>Professional engineering memberships</span></div>
          <div className="stat"><strong>01</strong><span>North star: make work clearer</span></div>
        </div>
      </section>

      <section className="journey section-shell section-padding" id="journey">
        <div className="section-kicker light"><span>02</span><span>THE CAREER JOURNEY</span></div>
        <div className="journey-intro"><h2>A career built<br /><span>in motion.</span></h2><p>Every role added another lens: infrastructure, people, projects, products — and the systems connecting them.</p></div>
        <div className="timeline">
          {timeline.map((item, index) => (
            <article className={`timeline-item ${index === 0 ? "current" : ""}`} key={`${item.year}-${item.company}`}>
              <div className="timeline-meta"><span className="timeline-number">0{index + 1}</span><span>{item.year}</span></div>
              <div className="timeline-marker"><span /></div>
              <div className="timeline-content"><div className="tag">{item.tag}</div><h3>{item.role}</h3><p className="company">{item.company}</p><p>{item.body}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities section-shell section-padding" id="capabilities">
        <div className="section-kicker"><span>03</span><span>WHAT I BRING TO THE TABLE</span></div>
        <div className="capabilities-intro"><h2>Make the system<br /><span>make sense.</span></h2><p>My edge is pattern recognition: seeing where information, people or technology lose momentum — then building the bridge.</p></div>
        <div className="capability-grid">
          {capabilityCards.map((card) => <article className={`capability-card ${card.accent}`} key={card.number}><span className="card-number">{card.number}</span><span className="card-arrow"><ArrowUpRight size={17} /></span><h3>{card.title}</h3><p>{card.body}</p></article>)}
        </div>
      </section>

      <DigitalTwinChat />

      <section className="portfolio section-shell section-padding" id="portfolio">
        <div className="section-kicker light"><span>05</span><span>WORK / IN PROGRESS</span></div>
        <div className="portfolio-top"><div><h2>Proof is<br /><span>in the build.</span></h2></div><p>A portfolio of systems, interfaces and operational improvements is taking shape. Until then, here is the kind of work I am building toward.</p></div>
        <div className="project-grid">
          <article className="project-card project-large"><div className="project-visual visual-grid"><span className="visual-label">01 / SYSTEMS</span><div className="dashboard"><span /><span /><span /><div /></div></div><div className="project-copy"><span>Coming next</span><h3>Operations, made visible.</h3><p>Dashboards and internal tools that give teams a clearer view of the work in motion.</p><ArrowUpRight /></div></article>
          <article className="project-card"><div className="project-visual visual-lilac"><span className="visual-label">02 / WORKFLOWS</span><div className="flow-lines"><i /><i /><i /><i /></div></div><div className="project-copy"><span>Coming next</span><h3>From process to progress.</h3><p>Workflow systems that turn scattered steps into a dependable operating rhythm.</p><ArrowUpRight /></div></article>
          <article className="project-card"><div className="project-visual visual-orange"><span className="visual-label">03 / WEB</span><div className="web-window"><span /><span /><span /><b>build<br />better.</b></div></div><div className="project-copy"><span>Coming next</span><h3>Digital, with purpose.</h3><p>Web experiences that make the right next step feel obvious.</p><ArrowUpRight /></div></article>
        </div>
      </section>

      <section className="contact section-shell section-padding" id="contact">
        <div className="contact-glow" aria-hidden="true" />
        <div className="section-kicker"><span>06</span><span>OPEN CHANNEL</span></div>
        <div className="contact-layout"><div><h2>Let&apos;s build<br /><span>what&apos;s next.</span></h2></div><div className="contact-copy"><p>For roles, collaborations or a good conversation about systems that should work better, reach out.</p><a className="email-link" href="mailto:pafalase@gmail.com">pafalase@gmail.com <ArrowUpRight /></a><div className="contact-details"><a href="tel:+2348029085195">+234 802 908 5195</a><span>Abuja, Nigeria</span></div></div></div>
        <footer className="site-footer"><span>© 2026 Peter Falase</span><span>IT / DIGITAL OPERATIONS / SYSTEMS</span><a href="#top">Back to top ↑</a></footer>
      </section>
    </main>
  );
}
