"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/commerce";
import { isBareRoute } from "@/lib/chrome";
import { cn } from "@/lib/utils";

/* Pages that already have their own bottom action keep the corner clear. */
const HIDDEN_ON = ["/product/", "/payment", "/cart", "/quick-list", "/market-packs/"];

/** WhatsApp is how a large share of Nigerian shoppers prefer to ask a question, one tap away, everywhere. */
export default function WhatsAppButton() {
  const pathname = usePathname() ?? "";
  if (isBareRoute(pathname) || HIDDEN_ON.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <a
      href={whatsappLink("Hi SwiftGrocers! I need help with my order.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "group fixed bottom-[calc(var(--tabbar-height)+1rem)] right-4 z-header flex h-14 items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-4 text-neutral-950 shadow-xl",
        "transition-[transform,padding] duration-base ease-out-quart hover:-translate-y-0.5 lg:bottom-6 lg:right-6 safe-bottom"
      )}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.46 15.04L2 22l5.1-1.53A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.03.9.9-2.95-.2-.31a8.2 8.2 0 1 1 6.81 3.7Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.17 3.68c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
      </svg>
      <span className="hidden text-sm font-bold sm:inline">Chat with us</span>
    </a>
  );
}
