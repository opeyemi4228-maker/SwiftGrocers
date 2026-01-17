'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Clock,
  Tag,
  ShoppingCart,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Gift,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addItem as addToCartShared } from '@/lib/cart';

const DealsPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  const spotlightDeal = {
    id: 'spotlight-1',
    name: 'Fresh Organic Produce Bundle',
    description:
      'Complete weekly fresh produce box with premium organic fruits and vegetables delivered to your door.',
    price: 12500,
    originalPrice: 18000,
    discount: 31,
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000',
    freeShipping: true,
    timeLeft: { hours: 12, minutes: 34, seconds: 22 },
    itemsSold: 145,
    stockLimit: 200,
  };

  const [timeLeft, setTimeLeft] = useState(spotlightDeal.timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const addToCart = (product) => {
    // use shared cart so other pages/ navbar reflect change
    addToCartShared(product, 1);
    setCart((prev) => [...prev, product.id]);
    setTimeout(() => setCart((prev) => prev.filter((i) => i !== product.id)), 1000);
  };

  const progress = (spotlightDeal.itemsSold / spotlightDeal.stockLimit) * 100;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* === HERO HEADER === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-gradient-to-r from-green-600 via-lime-500 to-green-700 py-20 text-center text-white overflow-hidden"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute mt-20 top-0 left-0 right-0 opacity-20 text-9xl font-black tracking-tighter"
          >
            DEALS
          </motion.div>
          <div className="relative z-10">
            <h1 className="text-5xl mt-10 md:text-6xl font-extrabold drop-shadow-lg">
              Exclusive Deals of the Day
            </h1>
            <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto">
              Handpicked offers and hot deals updated daily. Grab yours while it lasts!
            </p>
          </div>
        </motion.div>

        {/* === SPOTLIGHT DEAL === */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-7 h-7 text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Spotlight Deal</h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl shadow-lg border border-orange-200 overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Image Side */}
              <div className="relative group">
                <div className="absolute -top-4 -left-4 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse shadow-lg">
                  -{spotlightDeal.discount}%
                </div>
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  src={spotlightDeal.image}
                  alt={spotlightDeal.name}
                  className="rounded-2xl w-full h-full object-cover shadow-xl"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite('spotlight')}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                    favorites.includes('spotlight')
                      ? 'bg-red-600 text-white'
                      : 'bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  <Heart className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Info Side */}
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {spotlightDeal.name}
                </h3>
                <p className="text-gray-600 mb-5 text-lg leading-relaxed">
                  {spotlightDeal.description}
                </p>

                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-bold text-green-600">
                    ₦{spotlightDeal.price.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    ₦{spotlightDeal.originalPrice.toLocaleString()}
                  </span>
                </div>

                {spotlightDeal.freeShipping && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold mb-6 w-fit">
                    <Gift className="w-4 h-4" />
                    Free Shipping
                  </div>
                )}

                {/* Countdown */}
                <div className="bg-white p-6 rounded-2xl shadow mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-gray-900">
                      Deal ends in:
                    </span>
                  </div>
                  <div className="flex gap-4">
                    {['hours', 'minutes', 'seconds'].map((unit) => (
                      <div key={unit} className="text-center">
                        <motion.div
                          animate={
                            timeLeft.hours < 1 ? { scale: [1, 1.05, 1] } : {}
                          }
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-3xl font-bold rounded-lg px-5 py-3 shadow-lg"
                        >
                          {timeLeft[unit].toString().padStart(2, '0')}
                        </motion.div>
                        <p className="text-xs mt-1 uppercase text-gray-600">
                          {unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Sold: {spotlightDeal.itemsSold}</span>
                    <span>{spotlightDeal.stockLimit - spotlightDeal.itemsSold} left</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(spotlightDeal)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-full shadow-xl text-lg flex justify-center items-center gap-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default DealsPage;
