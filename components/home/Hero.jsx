import React from "react";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, MessageCircle, Star } from "lucide-react";
import { getBundle } from "@/lib/bundles";
import { whatsappLink } from "@/lib/commerce";
import { formatPrice } from "@/lib/utils";
import SmartImage from "@/components/ui/SmartImage";
import AdirePattern from "@/components/ui/AdirePattern";
import SearchBox from "@/components/layout/SearchBox";
import DeliverySlot from "@/components/location/DeliverySlot";
import HeroSlotCard from "./HeroSlotCard";

const SHOPPERS = [
  { initials: "AO", tone: "bg-brand-200 text-brand-900" },
  { initials: "IB", tone: "bg-accent-200 text-accent-700" },
  { initials: "CE", tone: "bg-info-soft text-info" },
  { initials: "TF", tone: "bg-danger-soft text-danger" },
];

/**
 * Hero.
 *
 * The headline names the job people are hiring us for, not going to the
 * market, and the proof underneath is specific (Jos tomatoes, Benue yam) so it
 * reads as true rather than as marketing.
 *
 * Three ways in, in order of intent: search for the person with one thing in
 * mind; paste a list for the person with a whole market list; WhatsApp for the
 * person who would rather just talk to someone. Delivery time is stated against
 * the shopper's own area, because "2 hours" means nothing until it is "by 2:45
 * PM to Lekki".
 */
export default function Hero() {
  const pack = getBundle("egusi-soup-pack");

  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-10 bg-brand-mesh" aria-hidden="true" />
      <div
        className="absolute -left-40 top-1/3 -z-10 h-[30rem] w-[30rem] rounded-full bg-accent-200/30 blur-3xl dark:bg-accent-700/10"
        aria-hidden="true"
      />

      <div className="container-page grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        {/* --- Copy, search, ways in --- */}
        <div className="min-w-0 animate-fade-up lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-brand-800 backdrop-blur dark:border-brand-800 dark:text-brand-200">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
            </span>
            We deliver in Lagos, Abuja, Port Harcourt &amp; Ibadan
          </span>

          <h1 className="mt-6 text-[2.4rem] font-extrabold leading-[1.02] min-[400px]:text-5xl text-content-strong sm:text-6xl xl:text-7xl">
            Fresh foodstuff,
            <span className="relative mt-1 block text-brand-700 dark:text-brand-400">
              delivered to you.
              <svg
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-[78%] text-accent-400"
                aria-hidden="true"
              >
                <path d="M2 9C60 3 140 1 298 6" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-content-muted">
            Tomatoes, yam, rice, crayfish and more, bought fresh this morning and brought to your
            door in about 2 hours.{" "}
            <span className="font-medium text-content-strong">Fair prices. Pay when it arrives.</span>
          </p>

          <DeliverySlot className="mt-6" />

          <div className="mt-4 hidden max-w-xl lg:block">
            <SearchBox size="lg" />
          </div>

          {/* Secondary routes in, for the list-holder and the talker. */}
          <div className="mt-4 flex max-w-xl flex-col gap-2.5 sm:flex-row">
            <Link
              href="/quick-list"
              className="group inline-flex flex-1 items-center gap-3 rounded-2xl border border-line bg-surface/90 px-4 py-3 backdrop-blur transition-[border-color,box-shadow] duration-fast hover:border-brand-400 hover:shadow-md"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <ClipboardList className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-sm font-semibold text-content-strong">Have a shopping list?</span>
                <span className="block text-xs text-content-muted">Type it in and we find everything</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-content-muted transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>

            <a
              href={whatsappLink("Hi SwiftGrocers! I'd like to place an order:\n")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-1 items-center gap-3 rounded-2xl border border-line bg-surface/90 px-4 py-3 backdrop-blur transition-[border-color,box-shadow] duration-fast hover:border-[#25D366] hover:shadow-md"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#25D366]/15 text-[#128C4A] dark:text-[#25D366]">
                <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-sm font-semibold text-content-strong">Order on WhatsApp</span>
                <span className="block text-xs text-content-muted">Chat with a real person</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-content-muted transition-transform duration-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>

          {/* Social proof, one compact line, not a stat grid. */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-3">
              <span className="flex -space-x-2.5" aria-hidden="true">
                {SHOPPERS.map((shopper) => (
                  <span
                    key={shopper.initials}
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-canvas text-2xs font-bold ${shopper.tone}`}
                  >
                    {shopper.initials}
                  </span>
                ))}
              </span>
              <span className="text-sm leading-tight">
                <span className="flex items-center gap-1 font-semibold text-content-strong">
                  <Star className="h-3.5 w-3.5 text-accent-400" fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  Rated 4.8 out of 5
                </span>
                <span className="text-content-muted">by 38,000+ customers</span>
              </span>
            </div>
          </div>
        </div>

        {/* --- Imagery --- */}
        <div className="relative min-w-0 lg:col-span-6 lg:pl-6">
          <div className="relative mx-auto max-w-[34rem]">
            {/* Indigo adire panel offset behind the photograph for depth. */}
            <div
              className="absolute -right-3 -top-3 bottom-10 left-10 overflow-hidden rounded-[2.25rem] bg-brand-800 text-brand-200 sm:-right-5 sm:-top-5 dark:bg-brand-900"
              aria-hidden="true"
            >
              <AdirePattern size={48} opacity={0.35} />
            </div>

            <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-sunken shadow-xl">
              <SmartImage
                src="https://images.unsplash.com/photo-1739300293398-468ba82fd418?auto=format&fit=crop&q=75&w=1100"
                alt="A shopper pushing a trolley of groceries down a supermarket aisle"
                priority
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-950/50 to-transparent" aria-hidden="true" />
            </figure>

            {/* Soup pack, the "one tap, whole pot" idea, shown not told. */}
            {pack ? (
              <Link
                href={pack.href}
                className="absolute -right-2 top-1/2 hidden w-44 -translate-y-1/2 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl transition-transform duration-base ease-out-quart hover:-translate-y-[calc(50%+2px)] md:block lg:-right-8 animate-fade-up [animation-delay:320ms]"
              >
                <span className="relative block aspect-[4/3] bg-surface-sunken">
                  <SmartImage src={pack.image} alt="" sizes="176px" className="object-cover" />
                  <span className="absolute left-2 top-2 rounded-full bg-accent-400 px-2 py-0.5 text-2xs font-bold text-neutral-950">
                    Save {pack.savingPercent}%
                  </span>
                </span>
                <span className="block p-3">
                  <span className="block text-sm font-bold leading-tight text-content-strong">{pack.name}</span>
                  <span className="mt-0.5 block text-xs text-content-muted">
                    {pack.contents.length} ingredients · serves {pack.serves}
                  </span>
                  <span className="tabular mt-1.5 block text-sm font-bold text-brand-700 dark:text-brand-300">
                    {formatPrice(pack.price)}
                  </span>
                </span>
              </Link>
            ) : null}

            <HeroSlotCard className="absolute -bottom-6 left-3 right-3 sm:left-auto sm:right-auto sm:-left-4 lg:-left-10 animate-fade-up [animation-delay:440ms]" />
          </div>
        </div>
      </div>
    </section>
  );
}
