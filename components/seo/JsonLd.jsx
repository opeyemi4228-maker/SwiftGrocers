import React from "react";

/**
 * Structured data. `<` is escaped so a product description can never close
 * the script tag early.
 */
export default function JsonLd({ data }) {
  const payload = Array.isArray(data) ? data : [data];
  return payload.map((entry, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, "\\u003c") }}
    />
  ));
}
