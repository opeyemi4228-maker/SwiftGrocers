import React from "react";
import SavedItems from "@/components/saved/SavedItems";

export const metadata = { title: "Saved items", robots: { index: false } };

export default function SavedPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Saved items</h1>
      <p className="mt-2 text-base text-content-muted">Things you&apos;ve hearted. They stay here until you remove them.</p>
      <SavedItems />
    </div>
  );
}
