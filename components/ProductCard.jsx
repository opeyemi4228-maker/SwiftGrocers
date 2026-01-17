"use client";

import React, { useState } from "react";
import Image from "next/image";

/**
 * ProductCard - improved add-to-cart behaviour
 * Writes cart to localStorage under 'swift_grocers_cart' and dispatches
 * a CustomEvent('cartUpdated', { detail: { count } }) so Navbar can update immediately.
 */
export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const {
    id,
    name,
    image,
    images = [],
    price,
    originalPrice,
    discountPercent,
    rating,
    reviewCount,
    weight,
    vendor,
    stock,
    tags = [],
    deliveryTime,
    isOrganic,
    isFresh,
    description,
    slug,
  } = product;

  const priceFormatted = (n) =>
    typeof n === "number" ? `₦${n.toLocaleString()}` : n;

  // Helpers to read & write cart
  const readCart = () => {
    try {
      const raw = localStorage.getItem("swift_grocers_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const writeCart = (cart) => {
    try {
      localStorage.setItem("swift_grocers_cart", JSON.stringify(cart));
      // Also create a storage-like event for other tabs (not necessary here but harmless)
      // Note: storage events don't fire in same tab, so we dispatch a custom event below.
      return true;
    } catch (e) {
      console.error("Failed to write cart", e);
      return false;
    }
  };

  const computeTotalCount = (cart) =>
    cart.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const addToCart = async () => {
    if (stock <= 0) return;
    setAdding(true);
    try {
      const cart = readCart();
      const existing = cart.find((it) => it.id === id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id,
          name,
          price,
          image: images[0] || image,
          quantity: 1,
          slug: slug || id,
        });
      }
      writeCart(cart);

      const totalCount = computeTotalCount(cart);

      // Dispatch a CustomEvent so same-tab components (Navbar) update immediately.
      // Include the computed count in event.detail for fast-path updates.
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { count: totalCount } })
      );
    } catch (e) {
      console.error("addToCart error", e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden group">
      <div className="relative w-full h-44 sm:h-56">
        <Image
          src={images[0] || image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover"
        />
        {discountPercent > 0 && (
          <span className="absolute left-3 top-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}
        {isOrganic && (
          <span className="absolute left-3 bottom-3 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
            Organic
          </span>
        )}
        {isFresh && !isOrganic && (
          <span className="absolute left-3 bottom-3 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
            Fresh
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-tight">
              {name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>

            <div className="mt-3 flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-yellow-400">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .587l3.668 7.431L23.6 9.587l-5.4 5.264L19.335 24 12 19.897 4.665 24l1.134-9.149L.4 9.587l7.932-1.569L12 .587z"/>
                </svg>
                <span className="text-gray-700 font-medium">{rating ?? "—"}</span>
                <span className="text-gray-400">({reviewCount ?? 0})</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {priceFormatted(price)}
                </div>
                {originalPrice && originalPrice > price && (
                  <div className="text-xs text-gray-400 line-through">
                    {priceFormatted(originalPrice)}
                  </div>
                )}
              </div>

              <div className="ml-auto text-right text-xs">
                <div className={`px-2 py-1 rounded-full font-medium ${stock > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                  {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                </div>
                {deliveryTime && <div className="text-[11px] text-gray-500 mt-1">{deliveryTime}</div>}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.slice(0, 4).map((t) => (
                <span key={t} className="text-[11px] px-2 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              {vendor?.logo && (
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-gray-100">
                  <Image src={vendor.logo} alt={vendor.name} width={28} height={28} className="object-cover" />
                </div>
              )}
              <div className="text-xs text-gray-600">
                <div className="font-medium text-gray-800">{vendor?.name}</div>
                {vendor?.rating && <div className="text-[11px] text-gray-500">{vendor.rating} ★ vendor</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={addToCart}
            disabled={adding || stock <= 0}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              stock > 0
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {adding ? "Adding…" : stock > 0 ? "Add to cart" : "Out of stock"}
          </button>

          <a
            href={`/products/${slug || id}`}
            className="text-sm text-green-600 border border-green-100 px-3 py-2 rounded-lg hover:bg-green-50"
          >
            View
          </a>
        </div>
      </div>
    </article>
  );
}