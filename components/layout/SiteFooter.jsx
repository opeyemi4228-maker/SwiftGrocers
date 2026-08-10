"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, Check, Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_SECTIONS, CONTACT_DETAILS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { isBareRoute } from "@/lib/chrome";
import Logo from "./Logo";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", path: "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .48 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 3.2a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.9a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6Zm6.9-11.2a1.55 1.55 0 1 1-3.1 0 1.55 1.55 0 0 1 3.1 0Z" },
  { label: "X", href: "https://x.com", path: "M17.5 3h3l-6.6 7.6L21.7 21h-5.9l-4.3-5.6L6.4 21H3.4l7-8L2.6 3h6l3.9 5.2L17.5 3Zm-1 16.1h1.6L8.1 4.8H6.3l10.2 14.3Z" },
  { label: "Facebook", href: "https://facebook.com", path: "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8h3.3Z" },
  { label: "TikTok", href: "https://tiktok.com", path: "M16.3 3c.3 2.1 1.5 3.4 3.6 3.6v2.4c-1.2.1-2.3-.2-3.5-.9v5.6c0 4.3-4.7 6.7-8.2 4.2-2.3-1.6-2.6-5-.7-7 1.1-1.2 2.7-1.7 4.3-1.4v2.5c-.4-.1-.8-.2-1.2-.1-1.2.1-2 1.1-1.9 2.3.1 1.1 1.1 2 2.3 1.9 1.2-.1 2-1 2-2.2V3h3.3Z" },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("done");
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="mt-4" noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state !== "idle") setState("idle");
          }}
          invalid={state === "error"}
          placeholder="you@example.com"
          aria-describedby="newsletter-status"
          className="sm:flex-1"
        />
        <Button type="submit" variant={state === "done" ? "subtle" : "primary"} className="shrink-0">
          {state === "done" ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> Subscribed
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={cn(
          "mt-2 text-xs",
          state === "error" ? "font-medium text-danger" : "text-content-muted"
        )}
      >
        {state === "error"
          ? "Enter a valid email address."
          : state === "done"
            ? "You're on the list. Look out for Thursday's deals."
            : "Weekly deals and seasonal picks. One email, no spam."}
      </p>
    </form>
  );
}

export default function SiteFooter() {
  const pathname = usePathname();

  // The account area renders without site chrome.
  if (isBareRoute(pathname)) return null;

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-content-muted">
            Fresh groceries from farms and vendors across Nigeria, picked the day you order and
            delivered to your door in as little as two hours.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className="inline-flex items-center gap-2.5 text-content transition-colors hover:text-brand-700 dark:hover:text-brand-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" />
                {CONTACT_DETAILS.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 text-content transition-colors hover:text-brand-700 dark:hover:text-brand-300"
              >
                <Phone className="h-4 w-4 shrink-0 text-content-muted" aria-hidden="true" />
                {CONTACT_DETAILS.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-content-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {CONTACT_DETAILS.address}
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-content-strong">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-content-muted transition-colors hover:text-brand-700 dark:hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-content-strong">
            Stay in the loop
          </h3>
          <Newsletter />

          <div className="mt-7 flex items-center gap-1">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-sunken hover:text-content-strong"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} SwiftGrocers Limited. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-content-muted transition-colors hover:text-content-strong">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-content-muted transition-colors hover:text-content-strong">
              Terms
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-content-muted transition-colors hover:text-content-strong"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
