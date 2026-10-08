# Project map and agent handoff

[Back to README](../README.md)

## Read first

Read `AGENTS.md`, the README, and `docs/project-overview.md`. If a student has created `docs/my-discovery-brief.md`, read it before changing their message or design. Do not assume that file exists or supply answers on the student's behalf.

This is the discovery phase of a CMS course. The working app is a local-content portfolio starter. The roadmap is context, not authorization to implement future capabilities. Supplemental guidance belongs in Markdown linked from the README.

## Where things live

| Location | Responsibility |
| --- | --- |
| `src/content/portfolio.ts` | Profile, verified professional summaries, skill groups, and separate sample project records |
| `src/app/page.tsx` | Personal editorial homepage, professional work links, and skills anchor |
| `src/app/about/page.tsx` | About presentation and optional email link |
| `src/app/work/page.tsx` | Professional summaries at project anchors, with a separate teaching-example archive |
| `src/app/work/[slug]/page.tsx` | Case-study template generated from project data |
| `src/app/layout.tsx` | Personal metadata, shared shell, contact anchor, course-resource footer, initial theme script |
| `src/components/header.tsx` | Brand and navigation |
| `src/lib/themes.ts` | Theme registry and default |
| `src/app/globals.css` | Semantic theme tokens and shared responsive styles |
| `src/components/ui/button.tsx` | Owned shadcn-compatible button |
| `src/app/learn/` and `src/content/` | Existing lessons and educational records |
| `src/app/studio/page.tsx` | Theme previews and customization instructions |
| `public/styles/` | Original SVG teaching illustrations |
| `Dockerfile`, `compose.yaml`, `compose.production.yaml` | Development and non-root standalone production stages; localhost workflows preserved |
| `docker-compose.deploy.yml`, `.env.server.example` | Same-server HTTPS QA/production stack, separate app networks and persistent ACME storage |
| `.github/workflows/deploy.yml`, `scripts/deploy-service.sh` | Validated GHCR builds; qa/main deploy only their selected service |
| `scripts/bootstrap-server.sh`, `scripts/harden-ssh.sh`, `docs/cicd-deployment.md` | Ubuntu 24.04 bootstrap, tested-account SSH hardening, practical/student handoff |
| `Dockerfile.prod`, `docker-compose.prod.yml` | Public-IP HTTP production stack with Traefik |
| `setup-server.sh`, `deploy.sh`, `docs/deployment.md` | Ubuntu 24.04 Docker installation, deployment commands, and assignment handoff |
| `tests/portfolio.spec.ts` | Browser checks, including themes and accessibility |
| `docs/` | Setup, discovery, AI, Docker, and project guidance |

Personalization currently spans several files: changing the profile name does not automatically replace the header, footer, homepage, or metadata. See [Make this portfolio yours](portfolio-starter.md) for the complete checklist. There is currently no blog route, CMS, or QR feature. Do not describe planned features as implemented.

## Practical deployment handoff

The public practical repository is https://github.com/yungjorge/is373-practical-test.
Production uses https://104-248-208-29.nip.io and QA uses
https://qa.104-248-208-29.nip.io on the same Ubuntu server, accessed as jorge.
The qa branch adds a visible “Deployment Status: QA Test” label on the homepage;
main receives it only after promotion. Both workflows run browser checks serially.
Real deployment and evidence collection require the Actions SSH key, trusted
host-key verification, and ACME email. See docs/cicd-deployment.md.

## Personal redesign handoff

The approved personal redesign uses Systems as the initial theme, with stone, orange, and dark green semantic tokens in `globals.css`. Base, Brutalist, Swiss, and Punk remain selectable; a saved browser preference still overrides the default. The professional navigation links to Work, About, homepage Skills, and the shared Contact section. Field guide and studio remain accessible through the footer.

`professionalProjects` supplies factual summaries for Freight Estimator API, ProdTrack, Printing from CRM, and ResumeButler. Homepage rows link to their anchors on `/work`, not to new case-study routes. The original `projects` array and all three sample case-study routes remain intact and explicitly labeled as teaching examples. Do not use sample illustrations as professional screenshots. Contact has an honest pending message until a real email is supplied.

The layout and behavior changes are covered by `tests/portfolio.spec.ts`, including the Systems default, all five themes, responsive Work/About pages, and professional navigation. The discovery brief retains the earlier checkpoint record and a separate redesign handoff. Professional evidence and peer feedback still require real human input.

## Implementation conventions

Read the installed Next.js guides before framework changes as required by AGENTS.md. Most pages are server-rendered components; interactive controls use small client components. Keep project slugs unique. Use semantic theme variables, meaningful image descriptions, and real evidence. Keep the neutral Base theme usable when adding overrides.

Preserve existing user changes. Prefer small edits within the established structure over introducing a new framework. Update documentation when behavior changes. Commands and verification details are in [Development reference](development.md); browser test setup is in [Make this portfolio yours](portfolio-starter.md).

## Handoff format

```text
Objective:
Student audience and desired action:
Decisions and reasons:
Files changed:
Checks run and results:
Known limitations / checks not run:
Next bounded task:
```

Do not put credentials, private student records, or unnecessary personal details in a handoff. Keep the handoff factual and distinguish project state from suggestions.
