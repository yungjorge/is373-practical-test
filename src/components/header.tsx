"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemePicker } from "./theme-picker";
export function Header() {
  const path = usePathname();
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Jorge Sanchez home">
        JS<span className="wordmark-dot">.</span>
      </Link>
      <nav aria-label="Main navigation">
        {[
          ["/work", "Work"],
          ["/about", "About"],
          ["/#skills", "Skills"],
          ["/#contact", "Contact"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={
              path === href || path.startsWith(href + "/") ? "page" : undefined
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <ThemePicker />
    </header>
  );
}
