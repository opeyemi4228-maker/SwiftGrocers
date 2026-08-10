"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Lock, Mail, Truck, User } from "lucide-react";
import { useUserStore } from "@/lib/states/userStore";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input, { Field } from "@/components/ui/Input";
import Logo from "@/components/layout/Logo";

const BENEFITS = [
  "Reorder a past basket in two taps",
  "Track your driver on the map",
  "Save addresses and payment methods",
  "Members-only weekly deals",
];

/** Rough password strength signal. Deliberately advisory, never blocking. */
function strengthOf(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const STRENGTH = [
  { label: "Too short", bar: "w-1/4 bg-danger" },
  { label: "Weak", bar: "w-2/4 bg-warning" },
  { label: "Good", bar: "w-3/4 bg-brand-500" },
  { label: "Strong", bar: "w-full bg-brand-600" },
];

export default function AuthPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ firstName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const isSignUp = mode === "signup";
  const strength = strengthOf(form.password);

  const set = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const next = {};
    if (isSignUp && !form.firstName.trim()) next.firstName = "We need a name for your deliveries.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    // No auth backend is wired up yet; this stands in for that call.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setUser({
      id: form.email,
      email: form.email,
      firstName: form.firstName || form.email.split("@")[0],
    });
    setBusy(false);
    toast.success(isSignUp ? "Account created" : "Welcome back");
    router.push("/shop");
  };

  return (
    <div className="min-h-dvh">
      {/*
        Sign-in renders without the site header, footer or tab bar (see
        `lib/chrome.js`), so this bar carries the only way back out.
      */}
      <div className="border-b border-line bg-surface/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="-ml-1 inline-flex items-center gap-2 rounded-full py-2 pl-1 pr-4 text-sm font-medium text-content transition-colors hover:bg-surface-sunken hover:text-content-strong"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </span>
            Back
          </button>

          <Logo size="sm" />
        </div>
      </div>

      <div className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-line bg-surface shadow-lg lg:grid-cols-2">
        {/* --- Value panel --- */}
        <aside className="hidden flex-col justify-between bg-brand-900 p-10 text-neutral-0 lg:flex">
          <Logo href="/" size="md" className="brightness-0 invert" />

          <div>
            <h2 className="text-3xl font-bold leading-tight text-neutral-0">
              Groceries that arrive before you have unpacked the last bag.
            </h2>

            <ul className="mt-8 space-y-3.5">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-neutral-0/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-center gap-2.5 border-t border-white/15 pt-6 text-sm text-neutral-0/70">
            <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
            12,400 households across Lagos, Abuja and Port Harcourt
          </p>
        </aside>

        {/* --- Form --- */}
        <div className="p-7 sm:p-10">
          <div
            className="inline-flex rounded-full bg-surface-sunken p-1"
            role="tablist"
            aria-label="Authentication mode"
          >
            {[
              { key: "signin", label: "Sign in" },
              { key: "signup", label: "Create account" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={mode === tab.key}
                onClick={() => {
                  setMode(tab.key);
                  setErrors({});
                }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-fast",
                  mode === tab.key
                    ? "bg-surface text-content-strong shadow-sm"
                    : "text-content-muted hover:text-content-strong"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h1 className="mt-8 text-2xl font-bold sm:text-3xl">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-content-muted">
            {isSignUp
              ? "Two fields and you are done. No card needed until checkout."
              : "Sign in to reorder, track deliveries and see your saved items."}
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
            {isSignUp ? (
              <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
                <Input
                  value={form.firstName}
                  onChange={set("firstName")}
                  autoComplete="given-name"
                  placeholder="Amaka"
                  leadingIcon={User}
                />
              </Field>
            ) : null}

            <Field label="Email address" htmlFor="email" required error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                placeholder="you@example.com"
                leadingIcon={Mail}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              required
              error={errors.password}
              hint={isSignUp ? "At least 8 characters." : undefined}
            >
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder={isSignUp ? "Choose a password" : "Your password"}
                leadingIcon={Lock}
                trailingSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="grid h-8 w-8 place-items-center rounded-full text-content-muted transition-colors hover:bg-surface-sunken hover:text-content-strong"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </Field>

            {isSignUp && form.password ? (
              <div aria-live="polite">
                <div className="h-1 overflow-hidden rounded-full bg-line">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-base",
                      STRENGTH[Math.max(0, strength - 1)].bar
                    )}
                  />
                </div>
                <p className="mt-1.5 text-xs text-content-muted">
                  Password strength: {STRENGTH[Math.max(0, strength - 1)].label}
                </p>
              </div>
            ) : null}

            {!isSignUp ? (
              <div className="flex items-center justify-between">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-content">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 cursor-pointer rounded border-line-strong accent-brand-600"
                  />
                  Keep me signed in
                </label>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300"
                >
                  Forgot password?
                </Link>
              </div>
            ) : null}

            <Button type="submit" size="lg" block loading={busy}>
              {isSignUp ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-content-muted">
            {isSignUp ? "Already have an account?" : "New to SwiftGrocers?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignUp ? "signin" : "signup")}
              className="font-semibold text-brand-700 hover:underline dark:text-brand-300"
            >
              {isSignUp ? "Sign in instead" : "Create an account"}
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-content-muted">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
