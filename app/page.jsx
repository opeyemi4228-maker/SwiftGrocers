import React from "react";
import { ArrowRight } from "lucide-react";
import { getBestsellers, getDeals, getNewArrivals } from "@/lib/products";
import { Section, SectionHeader } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import ProductRail from "@/components/ProductRail";
import ProductGrid from "@/components/ProductGrid";
import Hero from "@/components/home/Hero";
import CategoryRail from "@/components/home/CategoryRail";
import ValueStrip from "@/components/home/ValueStrip";
import PromoDuo from "@/components/home/PromoDuo";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import DealCountdown from "@/components/home/DealCountdown";
import PromoCarousel from "@/components/home/PromoCarousel";

export default function HomePage() {
  const deals = getDeals(8);
  const bestsellers = getBestsellers(8);
  const arrivals = getNewArrivals(4);

  return (
    <>
      <Hero />

      <Section size="sm" className="container-page">
        <SectionHeader
          eyebrow="Browse"
          title="Shop by category"
          description="Twelve aisles, one delivery, one receipt."
          action="Shop all"
          actionHref="/shop"
        />
        <CategoryRail />
      </Section>

      <Section size="sm" className="pb-0">
        <PromoCarousel />
      </Section>

      <Section size="sm" className="container-page">
        <div className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                Today only
              </p>
              <DealCountdown />
            </div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Deals worth the trip</h2>
            <p className="mt-3 text-base text-content-muted">
              Discounts we negotiated with vendors this week — not markdowns on things nobody
              wanted.
            </p>
          </div>

          <Button href="/deals" variant="outline" className="shrink-0">
            All deals
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <ProductRail products={deals} />
      </Section>

      <Section size="md" className="container-page">
        <PromoDuo />
      </Section>

      <Section size="sm" className="container-page">
        <SectionHeader
          eyebrow="Reordered most"
          title="What Nigeria keeps buying"
          description="The products that show up in the most repeat baskets."
          action="Shop all"
          actionHref="/shop"
        />
        <ProductGrid products={bestsellers} />
      </Section>

      <Section size="md" className="border-y border-line bg-surface">
        <div className="container-page">
          <SectionHeader
            eyebrow="How it works"
            title="From basket to doorstep in two hours"
            align="center"
          />
          <HowItWorks />
        </div>
      </Section>

      {arrivals.length > 0 ? (
        <Section size="sm" className="container-page">
          <SectionHeader
            eyebrow="Just landed"
            title="New this week"
            description="Fresh listings from vendors who joined the marketplace this month."
            action="See what's new"
            actionHref="/fresh-picks"
          />
          <ProductRail products={arrivals} />
        </Section>
      ) : null}

      <Section size="md" className="container-page">
        <SectionHeader
          eyebrow="Why people stay"
          title="Twelve thousand households, one standard"
          align="center"
        />
        <Testimonials />
      </Section>

      <Section size="sm" className="container-page pt-0">
        <ValueStrip />
      </Section>

      <section className="border-t border-line bg-brand-900 py-20 text-neutral-0 sm:py-28">
        <div className="container-page flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-neutral-0 sm:text-4xl">
              Your first order arrives before dinner.
            </h2>
            <p className="mt-5 text-base text-neutral-0/70">
              Sign up and get ₦2,000 off anything over ₦15,000. No card needed until checkout, and
              you can pay the driver instead if you would rather.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href="/auth" size="xl" variant="accent">
              Create an account
            </Button>
            <Button
              href="/shop"
              size="xl"
              variant="outline"
              className="border-white/25 bg-transparent text-neutral-0 hover:border-white hover:bg-white/10 hover:text-neutral-0"
            >
              Browse first
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
