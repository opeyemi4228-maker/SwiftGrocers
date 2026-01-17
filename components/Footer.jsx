"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const validateEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase());

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus("error");
      return;
    }
    // TODO: hook into real subscription API
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company / Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Swiftgrocers</h3>
            <p className="text-sm text-gray-700 mb-4">
              Swiftgrocers is a low-price online grocery supermarket that allows you to order products across categories and gets them delivered to your doorstep.
            </p>

            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <strong className="mr-2">Email:</strong>
                <a href="mailto:hello@swiftgrocers.com.ng" className="text-green-600 hover:underline">
                  hello@swiftgrocers.com.ng
                </a>
              </div>
              <div>
                <strong className="mr-2">Phone:</strong>
                <a href="tel:+2349087206986" className="text-green-600 hover:underline">
                  +234 908 720 6986
                </a>
              </div>
              <div>
                <strong className="mr-2">Address:</strong>
                Prime Mall, Plot C110 69 Road, 6th Avenue, Abuja
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {/* Social icons as requested */}
              <a href="#" aria-label="Facebook" className="inline-block">
                <img width="48" height="48" src="https://img.icons8.com/ios-filled/100/facebook--v1.png" alt="facebook--v1" />
              </a>
              <a href="#" aria-label="Instagram" className="inline-block">
                <img width="48" height="48" src="https://img.icons8.com/glyph-neue/64/instagram-new--v1.png" alt="instagram-new--v1" />
              </a>
              <a href="#" aria-label="YouTube" className="inline-block">
                <img width="48" height="48" src="https://img.icons8.com/glyph-neue/64/youtube.png" alt="youtube" />
              </a>
              <a href="#" aria-label="TikTok" className="inline-block">
                <img width="48" height="48" src="https://img.icons8.com/ios-filled/100/tiktok--v1.png" alt="tiktok--v1" />
              </a>
              <a href="#" aria-label="X / TwitterX" className="inline-block">
                <img width="48" height="48" src="https://img.icons8.com/ios-filled/100/twitterx--v1.png" alt="twitterx--v1" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">ABOUT</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>
                  <Link href="/about" className="hover:text-green-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-green-600">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="hover:text-green-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-green-600">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">HELP & GUIDE</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>
                  <Link href="/terms" className="hover:text-green-600">
                    Term Of Use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-green-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-green-600">
                    Shipping & Delivery
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter & App badges */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">NEWSLETTER</h4>
            <p className="text-sm text-gray-700 mb-3">Don’t miss out thousands of great deals & promotions.</p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3" aria-label="Subscribe to newsletter">
              <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
              <input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your e-mail ..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
              >
                Subscribe
              </button>
            </form>

            <div aria-live="polite" className="text-sm mt-2">
              {status === "success" && <span className="text-green-600">Subscribed ✅</span>}
              {status === "error" && <span className="text-red-600">Enter a valid email</span>}
            </div>

            <div className="mt-6 flex items-center gap-4">
              {/* Play store / App Store images as requested */}
              <a href="#" aria-label="Get it on Google Play">
                <img width="48" height="48" src="https://img.icons8.com/doodle/96/google-play.png" alt="google-play" />
              </a>
              <a href="#" aria-label="Download on the App Store">
                <img width="64" height="64" src="https://img.icons8.com/cute-clipart/64/apple-app-store.png" alt="apple-app-store" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <div>© 2026 Swiftgrocers Limited. All rights reserved.</div>

          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-green-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-green-600">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="hover:text-green-600">
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed right-4 bottom-16 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          ↑
        </button>
      )}
    </footer>
  );
}