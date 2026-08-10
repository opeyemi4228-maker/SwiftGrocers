"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Building2, ChevronLeft, Home, MapPin } from "lucide-react";
import { useUserStore } from "@/lib/states/userStore";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input, { Field, Select, Textarea } from "@/components/ui/Input";

const LABELS = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Building2 },
  { id: "other", label: "Other", icon: MapPin },
];

export default function AddAddressPage() {
  const router = useRouter();
  const setDeliverTo = useUserStore((state) => state.setDeliverTo);

  const [label, setLabel] = useState("home");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    area: "",
    city: "Lagos",
    directions: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const next = {};
    if (!form.name.trim()) next.name = "Who should the driver ask for?";
    if (!/^[0-9+\s-]{7,}$/.test(form.phone)) next.phone = "Enter a reachable phone number.";
    if (form.street.trim().length < 6) next.street = "Enter the full street address.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    // No address service is wired up yet; this stands in for that call.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeliverTo(`${form.area || form.street}, ${form.city}`);
    setSaving(false);
    toast.success("Address saved");
    router.push("/cart");
  };

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-content-muted transition-colors hover:text-content-strong"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to account
      </Link>

      <div className="mx-auto mt-6 max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">Add a delivery address</h1>
        <p className="mt-2 text-base text-content-muted">
          The more precise this is, the faster the driver finds you. Landmarks help more than
          postcodes here.
        </p>

        <form onSubmit={submit} noValidate className="mt-10 space-y-6">
          <fieldset>
            <legend className="text-sm font-medium text-content-strong">Label this address</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {LABELS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setLabel(option.id)}
                  aria-pressed={label === option.id}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-fast",
                    label === option.id
                      ? "border-brand-600 bg-brand-600 text-primary-content"
                      : "border-line-strong bg-surface text-content hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950"
                  )}
                >
                  <option.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Full name" htmlFor="name" required error={errors.name}>
              <Input value={form.name} onChange={set("name")} autoComplete="name" placeholder="Amaka Nwosu" />
            </Field>

            <Field label="Phone number" htmlFor="phone" required error={errors.phone}>
              <Input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                autoComplete="tel"
                placeholder="0801 234 5678"
              />
            </Field>

            <Field
              label="Street address"
              htmlFor="street"
              required
              error={errors.street}
              className="sm:col-span-2"
            >
              <Input
                value={form.street}
                onChange={set("street")}
                autoComplete="street-address"
                placeholder="12 Admiralty Way"
              />
            </Field>

            <Field label="Area or estate" htmlFor="area">
              <Input value={form.area} onChange={set("area")} placeholder="Lekki Phase 1" />
            </Field>

            <Field label="City" htmlFor="city">
              <Select value={form.city} onChange={set("city")}>
                <option>Lagos</option>
                <option>Abuja</option>
                <option>Port Harcourt</option>
              </Select>
            </Field>

            <Field
              label="Directions for the driver"
              htmlFor="directions"
              hint="Gate colour, nearest landmark, which floor."
              className="sm:col-span-2"
            >
              <Textarea
                value={form.directions}
                onChange={set("directions")}
                placeholder="Blue gate directly opposite the pharmacy. Call when you reach the junction."
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-line pt-6">
            <Button type="submit" size="lg" loading={saving}>
              Save address
            </Button>
            <Button href="/cart" size="lg" variant="ghost">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
