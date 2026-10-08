import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { defaultTheme, themes, themeStorageKey } from "@/lib/themes";
import { portfolio } from "@/content/portfolio";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Jorge Sanchez | Business Systems Analyst + Systems Builder",
    template: "%s | Jorge Sanchez",
  },
  description:
    "Practical systems, automations, applications, and integrations. Professional and independent work by Jorge Sanchez.",
};
const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(${JSON.stringify(themes.map((t) => t.id))}.includes(t))document.documentElement.dataset.theme=t}catch(e){}`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={defaultTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="site-shell">
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <footer className="site-footer">
            <section
              id="contact"
              className="contact-section"
              aria-labelledby="contact-title"
            >
              <p className="technical-label">05 / Contact</p>
              <h2 id="contact-title">
                Good systems start
                <br />
                with a conversation.
              </h2>
              {portfolio.email ? (
                <a className="text-link" href={`mailto:${portfolio.email}`}>
                  {portfolio.email} ↗
                </a>
              ) : (
                <p>Contact details will be available here soon.</p>
              )}
            </section>
            <div className="footer-bottom">
              <Link href="/" className="footer-mark">
                JORGE SANCHEZ
              </Link>
              <span>Business / Systems / Development</span>
              <nav aria-label="Course resources">
                <Link href="/learn">IS373 field guide ↗</Link>
                <Link href="/studio">Theme studio ↗</Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
