"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Mail, MessageCircle, Phone } from "lucide-react";
import { FOOTER_SECTIONS, CONTACT_DETAILS } from "@/lib/navigation";
import { whatsappLink } from "@/lib/commerce";
import { isBareRoute } from "@/lib/chrome";
import Logo from "./Logo";
import PaymentMethods from "@/components/ui/PaymentMethods";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/swiftgrocers", path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6Zm6.9-11.2a1.55 1.55 0 1 1-3.1 0 1.55 1.55 0 0 1 3.1 0Z" },
  { label: "X", href: "https://x.com/swiftgrocers", path: "M17.5 3h3l-6.6 7.6L21.7 21h-5.9l-4.3-5.6L6.4 21H3.4l7-8L2.6 3h6l3.9 5.2L17.5 3Zm-1 16.1h1.6L8.1 4.8H6.3l10.2 14.3Z" },
  { label: "Facebook", href: "https://facebook.com/swiftgrocers", path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8h3.3Z" },
  { label: "TikTok", href: "https://tiktok.com/@swiftgrocers", path: "M16.3 3c.3 2.1 1.5 3.4 3.6 3.6v2.4c-1.2.1-2.3-.2-3.5-.9v5.6c0 4.3-4.7 6.7-8.2 4.2-2.3-1.6-2.6-5-.7-7 1.1-1.2 2.7-1.7 4.3-1.4v2.5c-.4-.1-.8-.2-1.2-.1-1.2.1-2 1.1-1.9 2.3.1 1.1 1.1 2 2.3 1.9 1.2-.1 2-1 2-2.2V3h3.3Z" },
];

export default function SiteFooter() {
  const pathname = usePathname();
  if (isBareRoute(pathname)) return null;

  return (
    <footer className="mt-auto bg-brand-950 text-neutral-0">
      <div className="container-page grid gap-8 py-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <span className="inline-flex rounded-xl bg-neutral-0 px-2.5 py-1.5">
            <Logo size="sm" />
          </span>
          <p className="mt-3 max-w-xs text-sm text-neutral-0/70">
            Nigeria&apos;s market, delivered to your door in under two hours.
          </p>

          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-neutral-0/85 transition-colors hover:text-neutral-0">
                <Phone className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                {CONTACT_DETAILS.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_DETAILS.email}`} className="inline-flex items-center gap-2 text-neutral-0/85 transition-colors hover:text-neutral-0">
                <Mail className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                {CONTACT_DETAILS.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink("Hi SwiftGrocers! Please add me to the weekly deals list.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neutral-0/85 transition-colors hover:text-neutral-0"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-accent-300" aria-hidden="true" />
                Weekly deals on WhatsApp
              </a>
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-1.5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`SwiftGrocers on ${social.label}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-neutral-0/80 transition-colors hover:bg-white/20 hover:text-neutral-0"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:col-span-8">
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent-300">{section.title}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-neutral-0/70 transition-colors hover:text-neutral-0">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-4 lg:flex-row">
          <div className="[&_li]:border-white/15 [&_li]:bg-white/5 [&_li]:text-neutral-0 [&_svg]:text-accent-300">
            <PaymentMethods compact />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-0/60">
            <span>© {new Date().getFullYear()} SwiftGrocers Limited</span>
            <Link href="/privacy" className="transition-colors hover:text-neutral-0">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-neutral-0">Terms</Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-neutral-0"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
