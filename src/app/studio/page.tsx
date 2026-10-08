import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Make it yours" };
export default function Studio() {
  return (
    <div className="section-pad">
      <PageIntro
        number="THE STUDIO / START HERE"
        title="Your work. Your rules."
      >
        <p>
          A reusable foundation for your portfolio. Start with your story,
          choose a visual direction, and make this site your own.
        </p>
      </PageIntro>
      <section className="studio-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / CHOOSE YOUR STARTING POINT</p>
            <h2>Same content. New character.</h2>
          </div>
        </div>
        <ThemePicker expanded />
        <p className="small-note">
          Your theme follows you across pages and is remembered in this browser.
          Base is the neutral foundation you can return to at any time; Systems
          is the portfolio’s initial theme. Saved preferences override the
          default.
        </p>
      </section>
      <section className="studio-section">
        <p className="eyebrow">02 / YOUR COMPONENT FOUNDATION</p>
        <h2>Small parts. A consistent system.</h2>
        <div className="component-demo">
          <div>
            <p className="eyebrow">ACTIONS</p>
            <div className="button-row">
              <Button asChild>
                <Link href="/work">See selected work ↗</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn">Read the guide ↗</Link>
              </Button>
              <Button disabled>Unavailable</Button>
            </div>
          </div>
          <div className="form-stack">
            <label htmlFor="sample-input">
              A labeled text field
              <input
                id="sample-input"
                placeholder="Try typing your project title"
              />
            </label>
            <p className="small-note">
              Demo only. This field does not submit or save data.
            </p>
          </div>
          <div className="callout">
            <strong>A useful default.</strong>
            <p>
              Every theme shares readable body text, visible focus, labeled
              controls, and the same content structure.
            </p>
          </div>
        </div>
      </section>
      <section className="studio-section">
        <p className="eyebrow">03 / MAKE IT PERSONAL</p>
        <h2>Your first five edits.</h2>
        <ol className="steps">
          <li>
            <h3>Introduce yourself</h3>
            <p>
              Edit <code>src/content/portfolio.ts</code>: your name, role,
              introduction, and contact address.
            </p>
          </li>
          <li>
            <h3>Replace the sample briefs</h3>
            <p>
              Use the project array in the same file. Keep a unique slug for
              each project and explain the problem, process, outcome, and
              reflection.
            </p>
          </li>
          <li>
            <h3>Add your images</h3>
            <p>
              Put your work in <code>public/</code>. Update image paths and
              descriptive alt text in your project components. Use images you
              created or have permission to share.
            </p>
          </li>
          <li>
            <h3>Set a default theme</h3>
            <p>
              Change <code>defaultTheme</code> in <code>src/lib/themes.ts</code>
              . Customize the semantic variables in{" "}
              <code>src/app/globals.css</code>; buttons, pages, and controls
              inherit them.
            </p>
          </li>
          <li>
            <h3>Review and publish your work</h3>
            <p>
              Update the homepage, metadata, header, and footer to your own
              identity. Check mobile layouts, keyboard navigation, links, and
              spelling. Run <code>npm run check</code> and{" "}
              <code>npm run build</code> before deploying.
            </p>
          </li>
        </ol>
      </section>
      <section className="exercise">
        <h2>Build with a point of view.</h2>
        <p>
          The field guide helps you choose a style, communicate the value of
          your work, and develop a consistent voice.
        </p>
        <Button asChild variant="outline">
          <Link href="/learn">Open the field guide ↗</Link>
        </Button>
      </section>
    </div>
  );
}
