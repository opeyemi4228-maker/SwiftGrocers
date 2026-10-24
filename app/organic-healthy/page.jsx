import React from "react";
import { Award, Leaf, ShieldCheck } from "lucide-react";
import { products } from "@/lib/products";
import CollectionPage from "@/components/shop/CollectionPage";
import { Section } from "@/components/ui/Section";

const STANDARDS = [
  {
    icon: Leaf,
    title: "Grown without synthetics",
    body: "No synthetic pesticides or fertilisers for at least three seasons before we list a farm.",
  },
  {
    icon: ShieldCheck,
    title: "Audited, not self declared",
    body: "Our team visits each farm annually and reviews input records. Certificates alone are not enough.",
  },
  {
    icon: Award,
    title: "Traceable to the plot",
    body: "Every organic listing names the farm and the region it came from. Ask us and we will show you.",
  },
];

export const metadata = {
  title: "Organic & healthy",
  description:
    "Certified organic produce, grains and pantry staples from farms we audit ourselves.",
};

export default function OrganicHealthyPage() {
  const organic = products.filter(
    (product) => product.isOrganic || product.tags?.includes("organic")
  );

  return (
    <CollectionPage
      eyebrow="Certified organic"
      title="Organic, without the organic price"
      description="We buy direct from farms we have visited, so the certification premium does not land on your receipt twice."
      image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=70&w=1800"
      imageAlt="Fresh vegetables piled high on a market stall"
      stats={[
        { value: `${organic.length}`, label: "organic listings" },
        { value: "42", label: "audited farms" },
        { value: "0", label: "synthetic inputs" },
      ]}
      products={organic}
      footerNote="Every product here carries NAFDAC registration or an equivalent organic certificate."
    >
      <Section size="sm" className="container-page border-b border-line">
        <ul className="grid gap-8 sm:grid-cols-3">
          {STANDARDS.map((standard) => (
            <li key={standard.title}>
              <standard.icon
                className="h-5 w-5 text-brand-600 dark:text-brand-400"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h2 className="mt-4 text-base font-semibold text-content-strong">{standard.title}</h2>
              <p className="mt-2 text-sm text-content-muted">{standard.body}</p>
            </li>
          ))}
        </ul>
      </Section>
    </CollectionPage>
  );
}
