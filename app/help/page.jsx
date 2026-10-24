import React from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { HOME_FAQ } from "@/lib/faq";
import { CONTACT_DETAILS } from "@/lib/navigation";
import { whatsappLink } from "@/lib/commerce";
import { faqLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import FAQ from "@/components/home/FAQ";

export const metadata = {
  title: "Help | Delivery, Payments, Refunds & FAQ",
  description: "Delivery times and areas, delivery fees, pay on delivery, refunds and SwiftPoints, answered. Or reach a real person on WhatsApp.",
  alternates: { canonical: "/help" },
};

const CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp", detail: "Fastest, replies in minutes", href: whatsappLink("Hi SwiftGrocers, I need help with"), external: true },
  { icon: Phone, label: "Call us", detail: CONTACT_DETAILS.phone, href: `tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", detail: CONTACT_DETAILS.email, href: `mailto:${CONTACT_DETAILS.email}` },
];

export default function HelpPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <JsonLd data={faqLd(HOME_FAQ)} />
      <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Help", path: "/help" }]} className="mb-5" />
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h1 className="text-3xl font-bold sm:text-5xl">How can we help?</h1>
          <p className="mt-3 text-base text-content-muted">Most answers are below. For anything about a live order, WhatsApp is quickest.</p>
          <ul className="mt-8 space-y-3">
            {CHANNELS.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-[border-color,box-shadow] hover:border-brand-300 hover:shadow-md"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <channel.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-content-strong">{channel.label}</span>
                    <span className="block text-xs text-content-muted">{channel.detail}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-content-muted">{CONTACT_DETAILS.hours}</p>
        </div>
        <div className="lg:col-span-8">
          <FAQ items={HOME_FAQ} />
        </div>
      </div>
    </div>
  );
}
