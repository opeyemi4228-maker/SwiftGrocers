'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useProducts } from '@/lib/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FreshPickHero from '@/components/FreshPickHero';
import { addItem as addToCartShared } from '@/lib/cart';

export default function FreshPicksPage() {
  const { products } = useProducts();

  const handleBuyNow = (product) => {
    addToCartShared(product, 1);
    // optionally redirect to cart or show toast
    // router.push('/cart'); // uncomment to send user straight to cart
  };

  return (
    <>
      <Navbar />
      <FreshPickHero />

      {/* --- Fresh Picks Section --- */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {/* Title */}
        <div className="text-center mb-14">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-900"
          >
            Our <span className="text-green-600">Fresh Picks</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-gray-500 text-lg"
          >
            Discover handpicked new arrivals and wholesome favorites — curated just for you.
          </motion.p>
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 },
            },
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer group"
            >
              <div className="relative w-full h-56">
                <Image
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mt-1">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-green-600 text-base">
                    ₦{product.price.toLocaleString('en-NG')}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-all" onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                i === 0
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-green-700 text-white py-16 mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Stay in the Loop with Fresh Picks
          </motion.h2>
          <p className="text-gray-200 mb-8">
            Subscribe for new arrivals, curated deals, and seasonal offers delivered straight to you.
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-gray-900 rounded-l-full focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-green-700 font-semibold rounded-r-full hover:bg-gray-100 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
