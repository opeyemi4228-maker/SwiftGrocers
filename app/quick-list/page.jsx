import React from "react";
import QuickListBuilder from "@/components/quicklist/QuickListBuilder";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export const metadata = {
  title: "Shopping List | Type Your Market List, We Find Everything",
  description:
    "Paste or type your foodstuff list the way you'd say it (ata rodo, 1 paint garri, tuber of yam) and SwiftGrocers finds every item in seconds. Delivered today.",
  alternates: { canonical: "/quick-list" },
};

export default function QuickListPage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Quick list", path: "/quick-list" }]} className="mb-5" />
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-5xl">Type your shopping list.</h1>
        <p className="mt-3 text-base text-content-muted sm:text-lg">
          Write one item on each line, any way you like. We find each one for you, then you check
          it and add everything with one tap.
        </p>
      </div>
      <QuickListBuilder />
    </div>
  );
}
