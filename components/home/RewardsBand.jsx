import React from "react";
import { Coins, Gift, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { REFERRAL_REWARD } from "@/lib/commerce";
import Button from "@/components/ui/Button";
import AdirePattern from "@/components/ui/AdirePattern";

/** SwiftPoints, loyalty stated as arithmetic, not adjectives. */
export default function RewardsBand() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-accent-400 text-neutral-950">
      <AdirePattern id="adire-rewards" size={64} opacity={0.12} className="text-neutral-950" />
      <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950/70">SwiftPoints</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-neutral-950 sm:text-5xl">
            Every ₦100 earns a point.
            <span className="block">Every point is ₦1 off.</span>
          </h2>
          <p className="mt-4 max-w-md text-base text-neutral-950/75">
            A ₦50,000 monthly shop earns you ₦500 back, automatically, no card to carry. Invite a
            friend and you both get {formatPrice(REFERRAL_REWARD)} off.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/rewards" size="lg" className="bg-neutral-950 text-neutral-0 hover:bg-neutral-800 hover:shadow-none">
              See how rewards work
            </Button>
            <Button href="/auth" size="lg" variant="outline" className="border-neutral-950/25 bg-transparent text-neutral-950 hover:border-neutral-950 hover:bg-neutral-950/5 hover:text-neutral-950">
              Join free
            </Button>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { icon: Coins, value: "1 pt", label: "per ₦100 spent" },
            { icon: Gift, value: "₦500", label: "birthday credit" },
            { icon: Users, value: formatPrice(REFERRAL_REWARD), label: "for you and a friend" },
          ].map((item) => (
            <li key={item.label} className="rounded-2xl bg-neutral-0/80 p-5 shadow-sm backdrop-blur">
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <p className="tabular mt-3 font-display text-3xl font-extrabold">{item.value}</p>
              <p className="text-sm text-neutral-950/70">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
