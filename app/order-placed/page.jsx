import React from "react";
import { getBestsellers } from "@/lib/products";
import ProductRail from "@/components/ProductRail";
import { Section, SectionHeader } from "@/components/ui/Section";
import OrderConfirmation from "@/components/order/OrderConfirmation";

export const metadata = {
  title: "Order confirmed",
  description: "Your SwiftGrocers order is confirmed and being packed.",
  robots: { index: false },
};

export default function OrderPlacedPage() {
  return (
    <>
      <div className="container-page py-14 sm:py-20">
        <OrderConfirmation />
      </div>

      <Section size="sm" className="container-page border-t border-line">
        <SectionHeader
          title="Add to your next order"
          description="Popular with people who ordered what you just did."
          action="Shop all"
          actionHref="/shop"
        />
        <ProductRail products={getBestsellers(8)} />
      </Section>
    </>
  );
}
