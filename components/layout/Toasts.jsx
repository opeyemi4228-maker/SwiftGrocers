"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

/**
 * Toast styling lives here rather than at each call site so every notification
 * in the app shares one appearance, driven by the theme tokens.
 */
export default function Toasts() {
  return (
    <Toaster
      position="bottom-center"
      gutter={10}
      containerClassName="!z-[90] !bottom-[calc(var(--tabbar-height)+1rem)]"
      toastOptions={{
        duration: 2600,
        className:
          "!max-w-sm !rounded-2xl !border !border-line !bg-surface !px-4 !py-3 !text-sm !font-medium !text-content-strong !shadow-lg",
        success: { iconTheme: { primary: "hsl(var(--brand-600))", secondary: "hsl(var(--neutral-0))" } },
        error: { iconTheme: { primary: "hsl(var(--danger))", secondary: "hsl(var(--neutral-0))" } },
      }}
    />
  );
}
