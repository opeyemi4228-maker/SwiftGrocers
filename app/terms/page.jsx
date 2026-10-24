import React from "react";
import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from "@/lib/commerce";
import LegalPage from "@/components/layout/LegalPage";

export const metadata = { title: "Terms of service", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      path="/terms"
      updated="24 October 2026"
      intro="These terms cover buying from SwiftGrocers. They are written to be read, not skimmed past. If anything is unclear, ask us."
      sections={[
        { heading: "Prices and payment", body: [`Prices are in naira and include VAT where it applies. Delivery is free over ${formatPrice(FREE_DELIVERY_THRESHOLD)}, otherwise ${formatPrice(STANDARD_DELIVERY_FEE)}. Fresh produce sold by weight may vary slightly; we charge for what we deliver, never more than the price you saw.`] },
        { heading: "Substitutions", body: ["If something is out of stock we call or message you before substituting. If we can't reach you, we leave it out and you are not charged for it."] },
        { heading: "Freshness guarantee and refunds", body: ["If any item arrives damaged, spoilt or wrong, tell us within 24 hours and we will refund or replace it. No photos needed for orders under ₦50,000."] },
        { heading: "Subscriptions", body: ["Subscriptions renew on the schedule you choose. You can skip, pause or cancel from your account at any time before the order is packed."] },
        { heading: "SwiftPoints", body: ["Points have no cash value, expire 12 months after they are earned, and cannot be transferred. We may withhold points from orders that are cancelled or refunded."] },
      ]}
    />
  );
}
