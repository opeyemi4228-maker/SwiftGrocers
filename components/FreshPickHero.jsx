'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { assets } from '@/assets/assets'; // Your image assets

const FreshPicksHero = () => {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={assets.Food1}
          alt="Fresh Picks Background"
          fill
          className="object-cover brightness-90"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 text-center mt-10 px-6">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-wide drop-shadow-lg"
        >
          Fresh Picks
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-lg md:text-2xl text-white/90 font-medium"
        >
          Explore the newest arrivals and top organic favorites
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <div className="flex w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-full shadow-xl overflow-hidden border border-white/40">
            <input
              type="text"
              placeholder="Search all fresh picks..."
              className="flex-1 px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent"
            />
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold transition-all">
              Search
            </button>
          </div>
        </motion.div>


      </div>
    </section>
  );
};

export default FreshPicksHero;
