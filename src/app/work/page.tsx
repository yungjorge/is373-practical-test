import Link from "next/link";
import { professionalProjects, projects } from "@/content/portfolio";
export const metadata = { title: "Work" };
export default function Work() {
  return (
    <div className="portfolio-section">
      <div className="editorial-heading">
        <p className="technical-label">Work / Project index</p>
        <h1 className="editorial-title">
          Practical problems.
          <br />
          Purposeful systems.
        </h1>
        <p>
          Professional and independent project summaries. Supporting artifacts
          are in preparation.
        </p>
      </div>
      <div className="project-records">
        {professionalProjects.map((project, i) => (
          <article
            className="project-record"
            id={project.slug}
            key={project.slug}
          >
            <div className="record-heading">
              <span className="work-number">0{i + 1}</span>
              <div>
                <p className="technical-label">{project.category}</p>
                <h2>{project.title}</h2>
              </div>
              <span className="record-label">{project.label}</span>
            </div>
            <dl>
              {[
                ["Problem", project.problem],
                ["System", project.system],
                ["My role", project.role],
                ["Technology", project.technology],
                ["Outcome / status", project.status],
              ].map(([term, text]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
            <p className="evidence-note">{project.evidence}</p>
          </article>
        ))}
      </div>
      <aside className="course-archive" aria-labelledby="archive-title">
        <p className="technical-label">IS373 / Learning archive</p>
        <h2 id="archive-title">Starter teaching examples</h2>
        <p>Course examples, separate from my professional work.</p>
        <div>
          {projects.map((project) => (
            <Link
              className="text-link"
              key={project.slug}
              href={`/work/${project.slug}`}
            >
              {project.title} ↗
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
