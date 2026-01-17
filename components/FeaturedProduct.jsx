'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { assets } from '@/assets/assets';

const categories = [
  { id: 1, name: 'Fresh Vegetables', image: assets.Vegetables, itemCount: '500+ items', href: '/shop', bgColor: 'bg-green-50', badgeColor: 'bg-green-600' },
  { id: 2, name: 'Fresh Fruits', image: assets.Fruit, itemCount: '400+ items', href: '/shop', bgColor: 'bg-red-50', badgeColor: 'bg-red-600' },
  { id: 3, name: 'Meat & Seafood', image: assets.Meat, itemCount: '200+ items', href: '/shop', bgColor: 'bg-blue-50', badgeColor: 'bg-blue-600' },
  { id: 4, name: 'Dairy & Eggs', image: assets.Egg, itemCount: '300+ items', href: '/shop', bgColor: 'bg-yellow-50', badgeColor: 'bg-yellow-500' },
  { id: 5, name: 'Bakery & Bread', image: assets.Bread, itemCount: '150+ items', href: '/shop', bgColor: 'bg-amber-50', badgeColor: 'bg-amber-600' },
  { id: 6, name: 'Grains & Staples', image: assets.Grains, itemCount: '250+ items', href: '/shop', bgColor: 'bg-orange-50', badgeColor: 'bg-orange-600' },
  { id: 7, name: 'Beverages', image: assets.Beverages, itemCount: '350+ items', href: '/category/beverages', bgColor: 'bg-purple-50', badgeColor: 'bg-purple-600' },
  { id: 8, name: 'Snacks & Treats', image: assets.Snacks, itemCount: '400+ items', href: '/category/snacks-treats', bgColor: 'bg-pink-50', badgeColor: 'bg-orange-600' },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Promotional Banner */}
        <div className="bg-gray-100 rounded-2xl p-6 sm:p-8 mb-12 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shopping made easy
            </h3>
            <p className="text-gray-600 text-base md:text-lg mt-1">
              Enjoy reliability, secure deliveries and hassle-free returns.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-6 md:px-8 py-3 rounded-full font-semibold text-sm md:text-base transition-all"
              aria-label="Start now - learn how it works"
            >
              Start now
            </Link>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>

        {/* Category Circles */}
        <div className="overflow-x-auto pb-4 -mx-4 md:mx-0">
          <div className="flex gap-6 px-4 md:px-0 snap-x snap-mandatory overflow-visible md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex flex-col items-center group snap-center md:static md:mx-0"
                aria-label={`${cat.name} — ${cat.itemCount}`}
              >
                <div
                  className={`flex items-center justify-center rounded-full ${cat.bgColor} overflow-hidden mb-4 transition-transform transform group-hover:scale-105 group-hover:shadow-xl`}
                  style={{ width: 150, height: 150 }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(min-width: 1024px) 180px, (min-width: 640px) 160px, 140px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 text-center text-sm md:text-base mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500">{cat.itemCount}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* View All Categories */}
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg"
            aria-label="View all categories"
          >
            <span>View all categories</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
