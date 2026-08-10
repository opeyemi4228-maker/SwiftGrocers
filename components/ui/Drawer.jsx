"use client";

import React, { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const panelBySide = {
  right: {
    className: "inset-y-0 right-0 h-full w-full max-w-md rounded-l-3xl",
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  left: {
    className: "inset-y-0 left-0 h-full w-[min(21rem,88vw)] rounded-r-3xl",
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
  bottom: {
    className: "inset-x-0 bottom-0 max-h-[88vh] w-full rounded-t-3xl",
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  },
};

/**
 * Modal side sheet: portalled, scroll-locked, Escape-closable, focus-trapped,
 * and it returns focus to whatever opened it.
 */
export default function Drawer({
  open,
  onClose,
  side = "right",
  title,
  description,
  footer,
  children,
  className,
  bodyClassName,
}) {
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  const config = panelBySide[side] ?? panelBySide.right;

  // Lock scroll without layout shift while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [open]);

  // Move focus in on open, return it on close.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement;

    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector(FOCUSABLE);
      (first ?? panel).focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(frame);
      const previous = restoreFocusRef.current;
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, [open]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null
      );
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-drawer" role="presentation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay/50 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            initial={config.initial}
            animate={config.animate}
            exit={config.exit}
            transition={{ type: "spring", stiffness: 380, damping: 40, mass: 0.9 }}
            className={cn(
              "absolute flex flex-col bg-surface shadow-xl outline-none",
              config.className,
              className
            )}
          >
            {(title || description) && (
              <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
                <div className="min-w-0">
                  {title ? (
                    <h2 id={titleId} className="truncate text-lg font-semibold">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id={descId} className="mt-0.5 text-sm text-content-muted">
                      {description}
                    </p>
                  ) : null}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </header>
            )}

            <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", bodyClassName)}>
              {children}
            </div>

            {footer ? (
              <footer className="border-t border-line bg-surface px-5 py-4 safe-bottom">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
