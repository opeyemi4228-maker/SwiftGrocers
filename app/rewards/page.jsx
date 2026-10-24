import React from "react";
import { Coins, Gift, ShoppingBasket, Users } from "lucide-react";
import { REFERRAL_REWARD } from "@/lib/commerce";
import { formatPrice } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import RewardsBand from "@/components/home/RewardsBand";
import FAQ from "@/components/home/FAQ";
import ReferralCard from "@/components/saved/ReferralCard";

export const metadata = {
  title: "SwiftPoints Rewards | Earn on Every Grocery Order",
  description: `Earn 1 SwiftPoint for every ₦100 you spend on groceries, worth ₦1 off your next order. Refer a friend and you both get ${formatPrice(REFERRAL_REWARD)}.`,
  alternates: { canonical: "/rewards" },
};

const STEPS = [
  { icon: ShoppingBasket, title: "Shop as usual", body: "Every order earns 1 point per ₦100 | packs and subscriptions included." },
  { icon: Coins, title: "Points land after delivery", body: "They appear in your account the moment the rider marks it delivered." },
  { icon: Gift, title: "Spend them at checkout", body: "Toggle ‘Use points’ and watch the total drop. No minimum." },
  { icon: Users, title: "Bring a friend", body: `They get ${formatPrice(REFERRAL_REWARD)} off their first order. You get ${formatPrice(REFERRAL_REWARD)} when it arrives.` },
];

const QUESTIONS = [
  { q: "Do SwiftPoints expire?", a: "Points stay in your account for 12 months after the order that earned them." },
  { q: "Can I use points with a promo code?", a: "Yes. Points apply after any promo code, on the final total." },
  { q: "Is there a limit to referrals?", a: "No limit. Each friend must be a new customer with a new phone number." },
];

export default function RewardsPage() {
  return (
    <>
      <div className="container-page pt-8">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Rewards", path: "/rewards" }]} />
      </div>
      <Section size="sm" className="container-page pt-6">
        <RewardsBand />
      </Section>
      <Section size="sm" className="container-page pt-0">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-line bg-surface p-6">
              <span className="text-xs font-bold text-content-muted">0{index + 1}</span>
              <step.icon className="mt-3 h-6 w-6 text-brand-600 dark:text-brand-400" aria-hidden="true" />
              <h2 className="mt-4 text-base font-semibold">{step.title}</h2>
              <p className="mt-1.5 text-sm text-content-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section size="sm" className="container-page grid gap-10 pt-0 lg:grid-cols-2">
        <ReferralCard />
        <FAQ items={QUESTIONS} />
      </Section>
    </>
  );
}
