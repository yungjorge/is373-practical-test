import Link from "next/link";
import {
  portfolio,
  professionalProjects,
  skillGroups,
} from "@/content/portfolio";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <>
      <section className="editorial-hero" aria-labelledby="home-title">
        <p className="technical-label">Deployment Status: QA Test</p>
        <div className="folio-line">
          <span>Independent thinking. Connected systems.</span>
          <span>Portfolio / 2026</span>
        </div>
        <h1 id="home-title" className="name-display">
          JORGE
          <span>
            SANCHEZ<span className="name-period">.</span>
          </span>
        </h1>
        <div className="hero-bottom">
          <div className="hero-position">
            <p className="technical-label">01 / Analysis into action</p>
            <h2>
              BUSINESS SYSTEMS ANALYST
              <br />
              <span>+ SYSTEMS BUILDER</span>
            </h2>
          </div>
          <div className="hero-statement">
            <p>{portfolio.intro}</p>
            <div className="button-row">
              <Button asChild>
                <Link href="/work">
                  View selected work <span aria-hidden="true">↗</span>
                </Link>
              </Button>
              <Link className="text-link" href="/about">
                About Jorge ↗
              </Link>
            </div>
          </div>
          <div className="system-mark" aria-hidden="true">
            <span className="mark-orbit" />
            <span className="mark-core" />
            <span className="mark-label">INPUT → SYSTEM → OUTPUT</span>
          </div>
        </div>
      </section>
      <div className="discipline-strip" aria-label="Areas of work">
        {["Business", "Systems", "Automation", "Development"].map((item, i) => (
          <span key={item}>
            <small>0{i + 1}</small>
            {item}
            <b aria-hidden="true">+</b>
          </span>
        ))}
      </div>
      <section className="portfolio-section" aria-labelledby="work-title">
        <div className="editorial-heading">
          <p className="technical-label">02 / Selected work</p>
          <h2 id="work-title">
            The problem.
            <br />
            <span className="muted-title">The system behind it.</span>
          </h2>
          <Link className="text-link" href="/work">
            Explore project summaries ↗
          </Link>
        </div>
        <div className="selected-work">
          {professionalProjects.map((project, i) => (
            <Link
              className="work-row"
              href={`/work#${project.slug}`}
              key={project.slug}
            >
              <span className="work-number">0{i + 1}</span>
              <div>
                <p className="technical-label">{project.category}</p>
                <h3>{project.title}</h3>
                <p className="work-summary">{project.summary}</p>
              </div>
              <div className="work-row-meta">
                <p>{project.technology}</p>
                <span>{project.label}</span>
              </div>
              <span className="row-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
        <p className="evidence-note">
          Project summaries from my own work. Detailed case studies and
          shareable artifacts are being prepared.
        </p>
      </section>
      <section
        id="skills"
        className="systems-section"
        aria-labelledby="skills-title"
      >
        <div className="editorial-heading">
          <p className="technical-label">03 / Technical ecosystem</p>
          <h2 id="skills-title">
            Different tools.
            <br />
            One connected picture.
          </h2>
          <p>
            Across business platforms, application development, and the
            connections between them.
          </p>
        </div>
        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <section key={group.title}>
              <span className="technical-label">0{i + 1}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
      <section
        className="portfolio-section about-preview"
        aria-labelledby="about-title"
      >
        <p className="technical-label">04 / Perspective</p>
        <div>
          <h2 id="about-title">
            Designed to make sense.
            <br />
            Built to do the work.
          </h2>
          <p>
            My path started in graphic design and prepress. It moved into
            information systems, then business systems analysis. I care about
            how a system works and how people find their way through it.
          </p>
          <Link href="/about" className="text-link">
            Read my background ↗
          </Link>
        </div>
      </section>
    </>
  );
}
