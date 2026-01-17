"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { assets } from "@/assets/assets";

// ✅ Departments (unique + scrollable)
const DEPARTMENTS = [
  { id: "all", label: "All Departments" },
  { id: "groceries", label: "Groceries" },
  { id: "beverages", label: "Beverages" },
  { id: "fruits", label: "Fruits" },
  { id: "household", label: "Household" },
  { id: "bakery", label: "Bakery" },
  { id: "frozen", label: "Frozen Foods" },
  { id: "personal", label: "Personal Care" },
  { id: "pets", label: "Pet Supplies" },
  { id: "baby", label: "Baby Products" },
  { id: "health", label: "Health & Wellness" },
  { id: "beauty", label: "Beauty & Skincare" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "office", label: "Office & Stationery" },
];

const LANGS = [
  { code: "en", label: "English", emoji: "🇬🇧", dir: "ltr" },
  { code: "fr", label: "French", emoji: "🇫🇷", dir: "ltr" },

];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userLocation, setUserLocation] = useState("Loading...");
  const [language, setLanguage] = useState(LANGS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const deptRef = useRef(null);
  const langRef = useRef(null);

  // new: cart count state & sync with localStorage (listens to 'cartUpdated' event)
  const [cartCount, setCartCount] = useState(0);

  // new: simple auth state (reads from localStorage 'swift_user')
  const [user, setUser] = useState(null);

  useEffect(() => {
    const computeCount = () => {
      try {
        const raw = localStorage.getItem('swift_grocers_cart');
        if (!raw) return 0;
        const items = JSON.parse(raw);
        if (!Array.isArray(items)) return 0;
        return items.reduce((sum, it) => sum + (it.quantity || 1), 0);
      } catch {
        return 0;
      }
    };

    const update = () => setCartCount(computeCount());

    // initial
    update();

    // listen for updates (CartManager.saveCart dispatches 'cartUpdated')
    window.addEventListener('cartUpdated', update);
    // also listen to storage events from other tabs
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener('cartUpdated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  // read auth from localStorage and react to changes from other tabs / custom events
  useEffect(() => {
    const loadUser = () => {
      try {
        const raw = localStorage.getItem("swift_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("authUpdated", loadUser);
    window.addEventListener("storage", (e) => {
      if (e.key === "swift_user") loadUser();
    });

    return () => {
      window.removeEventListener("authUpdated", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  // --- Auto detect location ---
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setUserLocation("Nigeria");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const loc =
            data?.address?.city ||
            data?.address?.state ||
            data?.address?.country ||
            "Nigeria";
          setUserLocation(loc);
        } catch {
          setUserLocation("Nigeria");
        }
      },
      () => setUserLocation("Nigeria"),
      { timeout: 5000 }
    );
  }, []);

  // --- Load saved language ---
  useEffect(() => {
    const saved = localStorage.getItem("swift_language");
    if (saved) {
      const found = LANGS.find((l) => l.code === saved);
      if (found) setLanguage(found);
    }
  }, []);

  // --- Outside click close ---
  useEffect(() => {
    const handleClick = (e) => {
      if (deptRef.current && !deptRef.current.contains(e.target))
        setDeptOpen(false);
      if (langRef.current && !langRef.current.contains(e.target))
        setLangOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem("swift_language", lang.code);
    document.documentElement.lang = lang.code;
    document.documentElement.dir = lang.dir || "ltr";
    setLangOpen(false);
  };

  const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop All" },
    { href: "/organic-healthy", label: "Organic & Healthy" },
    { href: "/deals", label: "Deals & Offers" },
    { href: "/categories", label: "Explore Categories" },
    { href: "/seasonal-specials", label: "Seasonal Specials" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact Us" },
  ];

  // <-- NEW: keep main content below navbar on small screens by syncing the navbar height -->
  useEffect(() => {
    const applyNavbarHeight = () => {
      const navEl = document.querySelector("nav");
      // try to find the main container that holds the hero content. Common options:
      const mainEl =
        document.querySelector("main") ||
        document.querySelector(".site-main") ||
        document.querySelector("#__next");

      if (!navEl) return;
      const h = Math.ceil(navEl.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--swift-navbar-height", `${h}px`);

      if (mainEl) {
        if (window.matchMedia("(max-width: 767px)").matches) {
          // apply on small screens only
          mainEl.style.paddingTop = `${h}px`;
        } else {
          // reset for larger screens
          mainEl.style.paddingTop = "";
        }
      }
    };

    // initial
    applyNavbarHeight();

    // update on resize and when menu states that change height
    const onResize = () => applyNavbarHeight();
    window.addEventListener("resize", onResize);

    // MutationObserver to catch DOM updates that might change header height (logo swap, menu open/close)
    const mo = new MutationObserver(applyNavbarHeight);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
  }, [menuOpen, deptOpen, langOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-[60] bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white shadow-md">
      {/* --- Top bar --- */}
      <div className="flex items-center justify-between px-4 md:px-10 py-2">
        {/* Logo + Location */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          {/* Reduced logo size by 20px: w-28 (112px) -> 92px; md:w-36 (144px) -> 124px */}
          <Image
            src={assets.logo}
            alt="SwiftGrocers"
            className="w-[70px] bg-white md:w-[124px]"
          />
          <div className="hidden sm:flex flex-col text-xs text-white leading-tight">
            <span className="opacity-80">Deliver to</span>
            <span className="font-semibold">{userLocation}</span>
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="hidden lg:flex items-center flex-1 max-w-3xl mx-6 gap-3">
          <div className="relative" ref={deptRef}>
            <button
              onClick={() => setDeptOpen((s) => !s)}
              className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-l-md text-sm hover:bg-white/20 focus:ring-2 focus:ring-green-300"
            >
              <span className="font-semibold">All</span>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M5.25 7.5l4.5 4.5 4.5-4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <AnimatePresence>
              {deptOpen && (
                <>
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                    className="fixed left-0 top-0 z-[80] w-80 h-screen bg-white text-gray-900 shadow-2xl p-6 department-menu"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Departments</h3>
                      <button
                        onClick={() => setDeptOpen(false)}
                        className="text-gray-700 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="department-menu-content overflow-y-auto pr-2">
                      <ul className="flex flex-col gap-2">
                        {DEPARTMENTS.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => {
                              setDeptOpen(false);
                              router.push(`/categories/${d.id}`);
                            }}
                            className="text-left w-full px-3 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition font-medium"
                          >
                            {d.label}
                          </button>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDeptOpen(false)}
                    className="fixed inset-0 z-[79] bg-black"
                  />
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center flex-1">
            <input
              type="text"
              placeholder="Search SwiftGrocers..."
              className="flex-1 px-3 py-2 text-sm text-gray-800 rounded-l-md outline-none"
            />
            <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-r-md hover:bg-yellow-500 transition">
              Search
            </button>
          </div>
        </div>

        {/* --- Right Side Icons --- */}
        <div className="hidden md:flex items-center gap-6 text-xs">
          <div
            onClick={() => (user ? router.push("/account") : router.push("/auth"))}
            className="flex items-center gap-3 cursor-pointer hover:text-yellow-300 focus:outline-none"
            aria-label={user ? "View account" : "Sign in or Sign up"}
          >
            {user ? (
              <>
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="text-xs opacity-90">Hello, {user.firstName || user.name || "User"}</p>
                  <p className="font-semibold text-sm">Account & Lists</p>
                </div>
              </>
            ) : (
              <div className="text-left">
                <p>Hello, Sign in</p>
                <p className="font-semibold">Account & Lists</p>
              </div>
            )}
          </div>

          <button
            onClick={() => router.push("/orders")}
            className="cursor-pointer hover:text-yellow-300 text-left"
          >
            <p>Returns</p>
            <p className="font-semibold">& Orders</p>
          </button>
          <div
            onClick={() => router.push("/cart")}
            className="flex items-center gap-1 cursor-pointer hover:text-yellow-300 relative"
            aria-label="View cart"
          >
            <Image src={assets.cart_icon} alt="cart" className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
            <span className="font-semibold">Cart</span>
          </div>
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((s) => !s)}
              className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full text-sm hover:bg-white/20 focus:ring-2 focus:ring-green-300"
            >
              <span>{language.emoji}</span>
              <span className="font-semibold">{language.label}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-md shadow-lg z-[95] overflow-hidden"
                >
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageSelect(l)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span>{l.emoji}</span>
                      <span className="flex-1">{l.label}</span>
                      {language.code === l.code && (
                        <span className="text-green-600 font-semibold">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(true)}
        >
          <Image src={assets.menu_icon} alt="menu" className="w-7 h-7" />
        </button>
      </div>

      {/* --- Lower Navigation Links --- */}
      <div className="hidden md:flex items-center justify-between bg-green-800 px-6 py-2 text-sm">
        <ul className="flex gap-8 relative">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`transition-all hover:text-yellow-300 ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {link.label}
                </Link>
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 bottom-[-2px] h-0.5 bg-yellow-300 w-full rounded"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2 text-xs">
          <span className="opacity-80">Language:</span>
          <span className="font-semibold">{language.label}</span>
        </div>
      </div>

      {/* --- Mobile Drawer --- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[85]"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 110, damping: 20 }}
              className="fixed top-0 left-0 w-72 h-full bg-white z-[90] p-5 shadow-lg overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                {/* Reduced drawer logo size as well for visual consistency */}
                <Image src={assets.logo} alt="SwiftGrocers" className="w-[92px]" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
              <ul className="flex flex-col gap-4 text-gray-800 font-medium relative">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href} className="relative">
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`transition-all ${
                          isActive ? "font-bold text-green-700" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                      {isActive && (
                        <motion.div
                          layoutId="underline"
                          className="absolute left-0 bottom-0 h-0.5 bg-green-700 w-full rounded"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 text-sm text-gray-600 border-t pt-4">
                <p>
                  Language: <span className="font-semibold">{language.label}</span>
                </p>
                <p>
                  Deliver to: <span className="font-semibold">{userLocation}</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}