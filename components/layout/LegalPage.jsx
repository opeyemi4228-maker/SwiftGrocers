import React from "react";
import Breadcrumbs from "./Breadcrumbs";

/** Plain-language legal page: short sections, real headings, a visible date. */
export default function LegalPage({ title, path, updated, intro, sections }) {
  return (
    <article className="container-prose py-10 sm:py-14">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: title, path }]} className="mb-5" />
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-content-muted">Last updated {updated}</p>
      <p className="mt-6 text-base leading-relaxed text-content">{intro}</p>
      {sections.map((section) => (
        <section key={section.heading} className="mt-9">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-sm leading-relaxed text-content">{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
