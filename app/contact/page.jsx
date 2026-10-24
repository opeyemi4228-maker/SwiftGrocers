"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Clock, Headphones, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { CONTACT_DETAILS } from "@/lib/navigation";
import Button from "@/components/ui/Button";
import Input, { Field, Select, Textarea } from "@/components/ui/Input";
import { Section, SectionHeader } from "@/components/ui/Section";
import Card from "@/components/ui/Card";

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "Live chat",
    detail: "Fastest, usually answered in under two minutes",
    action: "Start a chat",
    href: "#contact-form",
  },
  {
    icon: Phone,
    title: "Call us",
    detail: CONTACT_DETAILS.phone,
    action: "Call now",
    href: `tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`,
  },
  {
    icon: Mail,
    title: "Email",
    detail: CONTACT_DETAILS.email,
    action: "Send an email",
    href: `mailto:${CONTACT_DETAILS.email}`,
  },
];

const FAQS = [
  {
    q: "Something arrived damaged or not fresh. What now?",
    a: "Report it from the order page within 24 hours and we refund that line in full. No photos, no back and forth, we take your word for it.",
  },
  {
    q: "Can I change my delivery window after ordering?",
    a: "Yes, any time before our shopper starts packing your order. You will get a notification when that happens, usually 45 minutes before the window.",
  },
  {
    q: "Do you deliver outside Lagos, Abuja, Port Harcourt and Ibadan?",
    a: "Not yet. Enugu, Benin City and Kano are next. Message us on WhatsApp and we will tell you the day your area opens.",
  },
  {
    q: "Is there a minimum order?",
    a: "No minimum. Delivery is ₦1,500 under ₦25,000 and free above it.",
  },
];

const SUBJECTS = [
  "An order I placed",
  "Delivery or timing",
  "A refund or return",
  "Becoming a vendor",
  "Something else",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const set = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Tell us who you are.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 12) next.message = "A little more detail helps us help you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSending(true);
    // No messaging backend is wired up yet; this stands in for that call.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSending(false);
    setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    toast.success("Message sent. We reply within one working day.");
  };

  return (
    <>
      <header className="border-b border-line bg-brand-mesh">
        <div className="container-page py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-content-muted">
            <Link href="/" className="transition-colors hover:text-content-strong">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-content-strong">Contact</span>
          </nav>

          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
            Talk to someone who can actually fix it
          </h1>
          <p className="mt-4 max-w-xl text-lg text-content-muted">
            Real people in Abuja, 7 AM to 9 PM daily. No ticket queues, no bots pretending to be
            agents.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((channel) => (
              <li key={channel.title}>
                <Card padded="md" className="h-full">
                  <channel.icon
                    className="h-5 w-5 text-brand-600 dark:text-brand-400"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-sm font-semibold text-content-strong">
                    {channel.title}
                  </h2>
                  <p className="mt-1 text-sm text-content-muted">{channel.detail}</p>
                  <a
                    href={channel.href}
                    className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                  >
                    {channel.action}
                  </a>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <Section size="md" className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* --- Form --- */}
          <div className="lg:col-span-7">
            <h2 id="contact-form" className="scroll-mt-32 text-2xl font-semibold">
              Send us a message
            </h2>
            <p className="mt-2 text-base text-content-muted">
              We answer every message within one working day, usually much sooner.
            </p>

            <form onSubmit={submit} noValidate className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your name" htmlFor="name" required error={errors.name}>
                  <Input value={form.name} onChange={set("name")} autoComplete="name" placeholder="Amaka Nwosu" />
                </Field>

                <Field label="Email address" htmlFor="email" required error={errors.email}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <Field label="What is this about?" htmlFor="subject">
                <Select value={form.subject} onChange={set("subject")}>
                  {SUBJECTS.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Message"
                htmlFor="message"
                required
                error={errors.message}
                hint="Include your order number if you have one, it gets you a faster answer."
              >
                <Textarea
                  value={form.message}
                  onChange={set("message")}
                  rows={6}
                  placeholder="Tell us what happened…"
                />
              </Field>

              <Button type="submit" size="lg" loading={sending} trailingIcon={Send}>
                Send message
              </Button>
            </form>
          </div>

          {/* --- Details --- */}
          <aside className="lg:col-span-5">
            <Card padded="lg" variant="sunken">
              <h2 className="text-base font-semibold text-content-strong">Where to find us</h2>

              <dl className="mt-5 space-y-5 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <div>
                    <dt className="font-medium text-content-strong">Head office</dt>
                    <dd className="mt-0.5 text-content-muted">{CONTACT_DETAILS.address}</dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <div>
                    <dt className="font-medium text-content-strong">Support hours</dt>
                    <dd className="mt-0.5 text-content-muted">
                      Monday to Sunday, 7:00 AM to 9:00 PM WAT
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Headphones className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                  <div>
                    <dt className="font-medium text-content-strong">Vendor enquiries</dt>
                    <dd className="mt-0.5 text-content-muted">
                      Selling with us? Mention it in the subject and it routes straight to the
                      partnerships team.
                    </dd>
                  </div>
                </div>
              </dl>
            </Card>
          </aside>
        </div>
      </Section>

      <Section size="md" className="container-page border-t border-line">
        <SectionHeader
          eyebrow="Before you write"
          title="Answers to the usual questions"
          description="Most people reaching out are asking one of these four things."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-line bg-surface p-5 transition-colors open:bg-surface-sunken"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-content-strong marker:hidden">
                <span className="flex items-start justify-between gap-4">
                  {faq.q}
                  <span
                    className="mt-0.5 shrink-0 text-content-muted transition-transform duration-base group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-content-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
