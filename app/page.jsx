import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getBestsellers, getDeals } from "@/lib/products";
import { BUNDLES } from "@/lib/bundles";
import { HOME_FAQ } from "@/lib/faq";
import { whatsappLink } from "@/lib/commerce";
import { faqLd, itemListLd } from "@/lib/seo";
import { Section, SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import PaymentMethods from "@/components/ui/PaymentMethods";
import JsonLd from "@/components/seo/JsonLd";
import ProductRail from "@/components/ProductRail";
import ProductGrid from "@/components/ProductGrid";
import PackCard from "@/components/packs/PackCard";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import CategoryRail from "@/components/home/CategoryRail";
import ContinueShopping from "@/components/home/ContinueShopping";
import DealCountdown from "@/components/home/DealCountdown";
import QuickListPromo from "@/components/home/QuickListPromo";
import SubscribeBand from "@/components/home/SubscribeBand";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import HowItWorks from "@/components/home/HowItWorks";

export const metadata = {
  title: { absolute: "SwiftGrocers | Buy Foodstuff & Groceries Online in Lagos, Abuja, PH & Ibadan" },
  description:
    "Order fresh foodstuff online: tomatoes, rice, yam, garri, egusi, palm oil and more, delivered in under 2 hours across Lagos, Abuja, Port Harcourt and Ibadan. Pay on delivery, free delivery over ₦25,000.",
  alternates: { canonical: "/" },
};

/**
 * Home.
 *
 * Ten sections, each with one job, ordered by a shopper's decision: what is
 * this and how fast (hero) → where do I start (aisles, their own history) →
 * why now (deals, packs) → can I trust it (bestsellers, reviews) → why come
 * back (subscriptions) → what if (FAQ). Editorial, coverage and loyalty
 * content lives on its own pages so the home page never becomes a wall.
 */
export default function HomePage() {
  const deals = getDeals(10);
  const bestsellers = getBestsellers(8);
  const packs = BUNDLES.slice(0, 4);

  return (
    <>
      <JsonLd data={[faqLd(HOME_FAQ.slice(0, 5)), itemListLd(bestsellers, "/")]} />

      <Hero />
      <Marquee />

      <Section size="sm" className="container-page">
        <SectionHeader eyebrow="How it works" title="Order in 3 easy steps" />
        <HowItWorks />
      </Section>

      <Section size="sm" className="container-page">
        <SectionHeader
          eyebrow="Categories"
          title="What would you like to buy?"
          description="Tap a category to see everything in it."
          action="See all products"
          actionHref="/shop"
        />
        <CategoryRail />
      </Section>

      <ContinueShopping />

      <Section size="sm" className="container-page">
        <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
                This week&apos;s deals
              </p>
              <DealCountdown />
            </div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Cheaper this week</h2>
            <p className="mt-3 text-base text-content-muted">
              These lower prices last until Wednesday night, or until the item sells out.
            </p>
          </div>

          <Button href="/deals" variant="outline" className="shrink-0">
            See all deals
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <ProductRail products={deals} />
      </Section>

      {/* --- Market packs --- */}
      <section className="border-y border-line bg-surface py-14 sm:py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Soup packs"
            title="Everything you need for one pot of soup"
            description="Each pack has all the ingredients, already measured. It costs less than buying them one by one."
            action="See all soup packs"
            actionHref="/market-packs"
          />
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {packs.map((pack, index) => (
              <div key={pack.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <PackCard pack={pack} priority={index < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section size="sm" className="container-page">
        <SectionHeader
          eyebrow="Most popular"
          title="What people buy the most"
          description="The items most people ordered last week."
          action="See all"
          actionHref="/shop?sort=popular"
        />
        <ProductGrid products={bestsellers} />
      </Section>

      <Section size="sm" className="container-page pt-0">
        <QuickListPromo />
      </Section>

      <Section size="sm" className="container-page pt-0">
        <SubscribeBand />
      </Section>

      <Section size="md" className="container-page">
        <SectionHeader
          eyebrow="Reviews"
          title="What our customers say"
          description="Rated 4.8 out of 5 in 12,400 reviews."
          align="center"
        />
        <Testimonials />
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-content-muted">Ways to pay</p>
          <PaymentMethods compact />
        </div>
      </Section>

      <Section size="sm" className="container-prose pt-0">
        <SectionHeader eyebrow="Questions" title="Common questions" align="center" />
        <FAQ items={HOME_FAQ.slice(0, 5)} />
        <p className="mt-6 text-center text-sm text-content-muted">
          Have another question?{" "}
          <a href={whatsappLink("Hi SwiftGrocers, I have a question:")} target="_blank" rel="noopener noreferrer" className="link-underline">
            Ask us on WhatsApp
          </a>
        </p>
      </Section>

      <section className="relative overflow-hidden border-t border-line bg-brand-900 py-20 text-neutral-0 sm:py-28">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-600/40 blur-3xl" aria-hidden="true" />
        <div className="container-page relative flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-neutral-0 sm:text-5xl">Get 20% off your first order</h2>
            <p className="mt-5 text-base text-neutral-0/75">
              Type the code <span className="font-bold text-accent-300">WELCOME20</span> when you pay. No card?
              No problem, pay with cash or transfer when your food arrives.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/shop" size="xl" variant="accent">
              Start shopping
            </Button>
            <Button
              as="a"
              href={whatsappLink("Hi SwiftGrocers! I'd like to place my first order.")}
              target="_blank"
              rel="noopener noreferrer"
              size="xl"
              variant="outline"
              leadingIcon={<MessageCircle />}
              className="border-white/25 bg-transparent text-neutral-0 hover:border-white hover:bg-white/10 hover:text-neutral-0"
            >
              Order on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
