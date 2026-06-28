"use client";

import Link from "next/link";

export default function SiteNav({ currentPage = "home" }: { currentPage?: "home" | "about" | "other" }) {
  return (
    <nav id="site-nav" className="site-nav" aria-label="Primary">
      <div className="nav-inner">
        <Link
          className="nav-link nav-home"
          href="/"
          aria-current={currentPage === "home" ? "page" : undefined}
        >
          HOME
        </Link>
        <Link className="nav-link nav-work" href="/#work">
          WORK
        </Link>
        <Link
          className="nav-link nav-info"
          href="/about"
          aria-current={currentPage === "about" ? "page" : undefined}
        >
          INFO
        </Link>
      </div>
    </nav>
  );
}
