"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Copy, MessageCircle } from "lucide-react";
import { REFERRAL_REWARD } from "@/lib/commerce";
import { useUserStore, useUserHydrated } from "@/lib/states/userStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

/** Referral link with one-tap WhatsApp share, where referrals actually travel in Nigeria. */
export default function ReferralCard() {
  const user = useUserStore((state) => state.user);
  const hydrated = useUserHydrated();
  const [copied, setCopied] = useState(false);
  const code = hydrated && user ? `${(user.firstName ?? "FRIEND").toUpperCase().slice(0, 6)}${String(user.id ?? "2000").slice(-3)}` : "SWIFT2000";
  const link = `https://swiftgrocers.com.ng/r/${code}`;
  const message = `I get my foodstuff from SwiftGrocers, delivered in 2 hours. Use my link for ${formatPrice(REFERRAL_REWARD)} off your first order: ${link}`;

  return (
    <div className="rounded-3xl bg-brand-800 p-7 text-neutral-0 dark:bg-brand-900">
      <h2 className="text-2xl font-bold text-neutral-0">Give {formatPrice(REFERRAL_REWARD)}, get {formatPrice(REFERRAL_REWARD)}.</h2>
      <p className="mt-2 text-sm text-neutral-0/75">Share your link. When a friend&apos;s first order is delivered, you both save.</p>
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 p-2 pl-4">
        <span className="min-w-0 flex-1 truncate font-mono text-sm">{link}</span>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link);
              setCopied(true);
              toast.success("Link copied");
            } catch {
              toast.error("Couldn't copy, select the link instead");
            }
          }}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-neutral-0 px-4 text-sm font-bold text-neutral-950"
        >
          <Copy className="h-4 w-4" aria-hidden="true" /> {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Button
        as="a"
        href={`https://wa.me/?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        block
        size="lg"
        leadingIcon={MessageCircle}
        className="mt-3 bg-[#25D366] text-neutral-950 hover:bg-[#25D366] hover:brightness-105 hover:shadow-none"
      >
        Share on WhatsApp
      </Button>
    </div>
  );
}
