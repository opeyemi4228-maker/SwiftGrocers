import React from "react";
import { ArrowRight, Check, ClipboardList, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/commerce";
import Button from "@/components/ui/Button";

const SAMPLE = ["2 tubers of yam", "ata rodo 500g", "1 paint garri", "crayfish", "palm oil 5L", "crate of eggs"];

/**
 * Shows the quick-list feature working rather than describing it: a handwritten
 * list on the left becomes matched products on the right.
 */
export default function QuickListPromo() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 text-neutral-0">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" aria-hidden="true" />

      <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300">New · Shopping list</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-neutral-0 sm:text-4xl">
            Have a shopping list?
            <span className="block text-neutral-0/60">Type it in. We&apos;ll find everything.</span>
          </h2>
          <p className="mt-4 max-w-md text-base text-neutral-0/75">
            Write it the way you normally would, &ldquo;ata rodo&rdquo;, &ldquo;1 paint garri&rdquo;,
            &ldquo;tuber of yam&rdquo;. We find each item for you. You just check it and pay.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/quick-list" size="lg" variant="accent" leadingIcon={<ClipboardList />}>
              Try it now
            </Button>
            <Button
              as="a"
              href={whatsappLink("Hi SwiftGrocers! Here's my list:\n")}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              leadingIcon={<MessageCircle />}
              className="border-white/25 bg-transparent text-neutral-0 hover:border-white hover:bg-white/10 hover:text-neutral-0"
            >
              Send it on WhatsApp
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
          <div className="rotate-[-2deg] rounded-2xl bg-[#fdf6e3] p-4 font-mono text-[13px] leading-7 text-neutral-800 shadow-xl sm:p-5">
            <p className="mb-1 border-b border-neutral-300 pb-1 font-sans text-2xs font-bold uppercase tracking-wider text-neutral-500">
              Saturday market
            </p>
            {SAMPLE.map((line) => (
              <p key={line} className="truncate">• {line}</p>
            ))}
          </div>
          <ArrowRight className="h-6 w-6 text-accent-300" aria-hidden="true" />
          <ul className="space-y-2">
            {SAMPLE.map((line, index) => (
              <li
                key={line}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-neutral-0 backdrop-blur animate-fade-up"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-brand-300" strokeWidth={3} aria-hidden="true" />
                <span className="truncate">Found</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
