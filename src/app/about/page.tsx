import Link from "next/link";
import { portfolio } from "@/content/portfolio";
export const metadata = { title: "About" };
export default function About() {
  return (
    <div className="portfolio-section">
      <div className="editorial-heading">
        <p className="technical-label">About / Jorge Sanchez</p>
        <h1 className="editorial-title">
          Design thinking.
          <br />
          Systems building.
        </h1>
        <p>{portfolio.role}</p>
      </div>
      <div className="biography-grid">
        <div className="about-emblem" aria-hidden="true">
          <span>JS</span>
          <small>FORM / FUNCTION</small>
        </div>
        <div className="biography-copy">
          <h2>A practical connection.</h2>
          <p>{portfolio.intro}</p>
          <p>
            I earned an A.A.S. in Graphic Design and worked in graphic design
            and prepress before moving into information systems. That background
            shapes how I organize information and think about the people using a
            system.
          </p>
          <p>
            I am transitioning from an Information Systems / Power Platform role
            at Peerless Umbrella into a Business Systems Analyst role at
            Services for the Underserved (S:US).
          </p>
          <p>
            My work spans operational tools, business applications, and
            integrations. I also build independently as the solo founder and
            developer of ResumeButler.
          </p>
          <Link className="text-link" href="/work">
            Explore my work ↗
          </Link>
        </div>
      </div>
      <section className="progression" aria-labelledby="progression-title">
        <p className="technical-label" id="progression-title">
          A progression of perspective
        </p>
        <ol>
          {[
            "Graphic design / Prepress",
            "Information systems",
            "Business systems analysis",
            "Systems builder",
          ].map((step, i) => (
            <li key={step}>
              <span>0{i + 1}</span>
              <h2>{step}</h2>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
