'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Calendar, Clock, Tag, TrendingUp, Star, Heart, ShoppingCart,
  ChevronRight, Gift, Flame, Sun, Snowflake, Leaf, Zap, Crown,
  Award, Package, Truck, Shield, ArrowRight, Filter, Search, X
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { addItem as addToCartShared } from '@/lib/cart';

const seasons = [
  { id: 'all', label: 'All Seasons', Icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'summer', label: 'Summer Deals', Icon: Sun, color: 'from-orange-500 to-yellow-500' },
  { id: 'winter', label: 'Winter Warmth', Icon: Snowflake, color: 'from-blue-500 to-cyan-500' },
  { id: 'harvest', label: 'Harvest Season', Icon: Leaf, color: 'from-green-500 to-emerald-500' },
  { id: 'festive', label: 'Festive Specials', Icon: Gift, color: 'from-red-500 to-pink-500' }
];

const categories = ['All', 'Groceries', 'Fresh Produce', 'Beverages', 'Snacks', 'Household', 'Personal Care'];

const seasonalProducts = [
  // ... (use the same products array from your previous code)
];

const features = [
  { Icon: Truck, title: 'Free Delivery', desc: 'On orders over ₦5,000' },
  { Icon: Clock, title: 'Limited Time', desc: 'Deals expire soon' },
  { Icon: Shield, title: 'Quality Assured', desc: '100% genuine products' },
  { Icon: Award, title: 'Best Prices', desc: 'Unbeatable seasonal deals' }
];

export default function SeasonalSpecialsPage() {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredProducts = seasonalProducts
    .filter(p => selectedSeason === 'all' || p.season === selectedSeason)
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
      if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
      if (sortBy === 'discount') return b.discount - a.discount;
      return b.rating - a.rating;
    });

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  const addToCart = (product) => {
    // Persist to shared cart (localStorage) and notify other UI
    addToCartShared(product, 1);
    // local visual feedback (temporary badge/button state)
    setCart(prev => [...prev, product.id]);
    setTimeout(() => setCart(prev => prev.filter(id => id !== product.id)), 2000);
  };

  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 font-[Montserrat]">

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-green-700 via-emerald-600 to-green-800 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360], x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360], x: [0, -100, 0], y: [0, -50, 0] }}
            transition={{ duration: 35, repeat: Infinity }}
            className="absolute right-10 bottom-10 w-[500px] h-[500px] rounded-full bg-yellow-300 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full mb-6">
              <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
              <span className="text-sm font-semibold">Limited Time Offers • Savings up to 30%</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Seasonal Specials
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mt-2">
                Unbeatable Deals
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-green-50 leading-relaxed mb-10">
              Discover handpicked seasonal offers on fresh produce, groceries, and household essentials. Limited quantities — shop before they're gone!
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all">
                <ShoppingCart className="w-5 h-5" /> Shop Now
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                <Tag className="w-5 h-5" /> View All Deals
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-20 fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* FEATURES BAR */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="flex items-center gap-3 justify-center">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <feature.Icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{feature.title}</div>
                <div className="text-sm text-gray-600">{feature.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEASON FILTER TABS */}
      <section className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {seasons.map(season => (
            <motion.button key={season.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedSeason(season.id)} className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${selectedSeason === season.id ? `bg-gradient-to-r ${season.color} text-white shadow-lg` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <season.Icon className="w-5 h-5" /> {season.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Search + Filter + Sort */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm p-6 mb-8 grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2"><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>}
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="relative">
            <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white cursor-pointer">
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div key={product.id} variants={fadeInUp} whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="relative overflow-hidden aspect-square">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">{product.badge}</div>
                <div className="absolute top-4 right-4 bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg">-{product.discount}%</div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleFavorite(product.id)} className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                  <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                </motion.button>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Ends in {product.endsIn}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-gray-500 font-medium mb-1">{product.category}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <div className="text-2xl font-extrabold text-green-600">₦{product.discountedPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addToCart(product)} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                  <ShoppingCart className="w-5 h-5" /> {cart.includes(product.id) ? 'Added to Cart!' : 'Add to Cart'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Package className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setSelectedSeason('all'); setSelectedCategory('All'); setSearchQuery(''); }} className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-bold">
              Reset Filters <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </section>
    </div>
    <Footer />
    </>
  );
}
