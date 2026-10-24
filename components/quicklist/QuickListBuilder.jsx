"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AlertCircle, Check, ClipboardPaste, MessageCircle, Sparkles, X } from "lucide-react";
import { parseList, SAMPLE_LIST } from "@/lib/quicklist";
import { useCartStore } from "@/lib/states/cartStore";
import { useDebounced } from "@/lib/hooks";
import { whatsappLink } from "@/lib/commerce";
import { cn, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import QuantityStepper from "@/components/ui/QuantityStepper";

const DRAFT_KEY = "swift:quick-list";

/**
 * The quick-list builder. Matching runs as you type; every line stays
 * editable, change the product, the quantity, or drop it, because a
 * confident guess the shopper cannot correct is worse than no guess.
 */
export default function QuickListBuilder() {
  const [text, setText] = useState("");
  const [overrides, setOverrides] = useState({});
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // An unsent list is worth keeping if the tab closes.
  useEffect(() => {
    try {
      const draft = window.localStorage.getItem(DRAFT_KEY);
      if (draft) setText(draft);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, text);
    } catch {
      /* storage unavailable */
    }
  }, [text]);

  const debounced = useDebounced(text, 180);
  const parsed = useMemo(() => parseList(debounced), [debounced]);

  const lines = parsed.map((line) => {
    const override = overrides[line.key] ?? {};
    const options = [line.match, ...line.alternatives].filter(Boolean);
    const product = override.productId ? options.find((entry) => entry.id === override.productId) : line.match;
    return {
      ...line,
      options,
      product: override.removed ? null : product,
      removed: Boolean(override.removed),
      quantity: override.quantity ?? line.quantity,
    };
  });

  const matched = lines.filter((line) => line.product);
  const unmatched = lines.filter((line) => !line.match);
  const total = matched.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const patch = (key, value) => setOverrides((previous) => ({ ...previous, [key]: { ...previous[key], ...value } }));

  const addAll = () => {
    matched.forEach((line) => addItem(line.product, line.quantity));
    toast.success(`${matched.length} items added to your cart`);
    openCart();
  };

  const paste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) setText(clip);
    } catch {
      toast.error("Couldn't read the clipboard, paste into the box instead");
    }
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* --- The list --- */}
      <div className="lg:col-span-5">
        <div className="rounded-3xl border border-line bg-[#fffaf0] p-1.5 shadow-sm dark:bg-surface">
          <label htmlFor="quick-list" className="sr-only">Your shopping list</label>
          <textarea
            id="quick-list"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setOverrides({});
            }}
            rows={12}
            placeholder={"e.g.\n2 tubers of yam\nata rodo\n1 paint garri\ncrate of eggs"}
            className="block w-full resize-y rounded-[1.25rem] bg-transparent px-4 py-4 font-mono text-[15px] leading-8 text-content-strong outline-none placeholder:text-content-muted/70"
            style={{ backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, hsl(var(--line)) 31px, hsl(var(--line)) 32px)", backgroundPositionY: "15px" }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" leadingIcon={ClipboardPaste} onClick={paste}>
            Paste from clipboard
          </Button>
          <Button variant="ghost" size="sm" leadingIcon={Sparkles} onClick={() => { setText(SAMPLE_LIST); setOverrides({}); }}>
            Try an example
          </Button>
          {text ? (
            <Button variant="ghost" size="sm" leadingIcon={X} onClick={() => { setText(""); setOverrides({}); }}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      {/* --- The matches --- */}
      <div className="lg:col-span-7">
        {lines.length === 0 ? (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-line-strong p-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-semibold text-content-strong">Your items appear here as you type</p>
            <p className="mt-1 max-w-sm text-sm text-content-muted">
              Local names work: ata rodo, ewa oloyin, okporoko, ugu, titus, dodo.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-line bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <p className="text-sm font-semibold text-content-strong" aria-live="polite">
                {matched.length} of {lines.length} matched
              </p>
              {unmatched.length ? (
                <span className="text-xs text-content-muted">{unmatched.length} need a human</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Everything found
                </span>
              )}
            </div>

            <ul className="divide-y divide-line">
              {lines.map((line) => (
                <li key={line.key} className={cn("flex flex-wrap items-center gap-3 px-5 py-3.5", line.removed && "opacity-50")}>
                  {line.match ? (
                    <>
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                        {line.product ? <SmartImage src={line.product.image} alt="" sizes="48px" className="object-cover" /> : null}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-2xs text-content-muted">“{line.raw}”</p>
                        {line.options.length > 1 && !line.removed ? (
                          <select
                            value={line.product?.id}
                            onChange={(event) => patch(line.key, { productId: event.target.value })}
                            aria-label={`Product for ${line.raw}`}
                            className="mt-0.5 w-full truncate rounded-md bg-transparent text-sm font-semibold text-content-strong outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {line.options.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name} · {option.unit}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="truncate text-sm font-semibold text-content-strong">{line.product?.name ?? line.match.name}</p>
                        )}
                        {line.product ? <p className="tabular text-xs text-content-muted">{line.product.unit} · {formatPrice(line.product.price)}</p> : null}
                      </div>
                      {line.removed ? (
                        <Button variant="ghost" size="xs" onClick={() => patch(line.key, { removed: false })}>Undo</Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <QuantityStepper
                            size="sm"
                            value={line.quantity}
                            onChange={(quantity) => patch(line.key, { quantity })}
                            onRemove={() => patch(line.key, { removed: true })}
                            max={line.product?.stock ?? 50}
                          />
                          <span className="tabular hidden w-20 text-right text-sm font-semibold text-content-strong sm:block">
                            {formatPrice(line.product.price * line.quantity)}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-warning-soft text-accent-700">
                        <AlertCircle className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-content-strong">“{line.raw}”</p>
                        <p className="text-xs text-content-muted">Not found, our WhatsApp shopper can source it.</p>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="sticky bottom-[calc(var(--tabbar-height)+0.5rem)] rounded-b-3xl border-t border-line bg-surface/95 p-5 backdrop-blur lg:bottom-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-content-muted">Estimated total</p>
                  <p className="tabular text-2xl font-bold text-content-strong">{formatPrice(total)}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  {unmatched.length ? (
                    <Button
                      as="a"
                      href={whatsappLink(`Hi SwiftGrocers! Can you find these for me?\n${unmatched.map((line) => `- ${line.raw}`).join("\n")}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      leadingIcon={MessageCircle}
                    >
                      Ask about {unmatched.length} item{unmatched.length === 1 ? "" : "s"}
                    </Button>
                  ) : null}
                  <Button size="lg" onClick={addAll} disabled={!matched.length}>
                    Add {matched.length} item{matched.length === 1 ? "" : "s"} to cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <p className="mt-4 text-xs text-content-muted">
          Prefer to talk? <Link href="/contact" className="link-underline">Contact us</Link> or send the list on WhatsApp, a real person will put your order together for you.
        </p>
      </div>
    </div>
  );
}
