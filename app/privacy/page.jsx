import React from "react";
import { CONTACT_DETAILS } from "@/lib/navigation";
import LegalPage from "@/components/layout/LegalPage";

export const metadata = { title: "Privacy policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      path="/privacy"
      updated="24 October 2026"
      intro="We collect only what we need to get your groceries to you, and we never sell your data. This policy explains what we hold, why, and how to have it removed, in line with the Nigeria Data Protection Act 2023."
      sections={[
        { heading: "What we collect", body: ["Your name, phone number, email and delivery addresses; your orders and payment status; and basic device information needed to keep the site secure. Card details are handled by our payment partner, Paystack, we never see or store your full card number."] },
        { heading: "Why we use it", body: ["To take and deliver orders, contact you about them, prevent fraud, and, only if you opt in, send you weekly deals by WhatsApp or email. You can opt out of marketing at any time."] },
        { heading: "Who we share it with", body: ["Riders see your name, phone number and address for the delivery they are making. Payment and messaging providers process data on our behalf under contract. We share nothing else unless the law requires it."] },
        { heading: "Your rights", body: [`You can ask to see, correct or delete your data, or withdraw consent, by emailing ${CONTACT_DETAILS.email}. We respond within 30 days.`] },
      ]}
    />
  );
}
