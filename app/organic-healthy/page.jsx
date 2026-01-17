'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Heart, ShoppingCart, Star, Filter,
  Search, X, Check, Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const products = [/* same product data you provided */];

const categories = ['All Products', 'Biscuits', 'Dried Fruits', 'Nuts', 'Seeds'];
const brands = ['Swift Organic', 'Germinal', 'Nature Valley', 'Healthy Choice'];
const priceRanges = [
  { label: '₦0 - ₦3,000', min: 0, max: 3000 },
  { label: '₦3,000 - ₦5,000', min: 3000, max: 5000 },
  { label: '₦5,000 - ₦7,000', min: 5000, max: 7000 },
  { label: '₦7,000+', min: 7000, max: 999999 },
];

export default function FreshPicksPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products
    .filter(p => selectedCategory === 'All Products' || p.category === selectedCategory)
    .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
    .filter(p => !selectedPriceRange || (p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max))
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product.id]);
    setTimeout(() => setCart(prev => prev.filter(i => i !== product.id)), 1000);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All Products');
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    setSearchQuery('');
  };

  return (
    <div className="font-[Montserrat]">
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">

        {/* HERO SECTION */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=2000"
            alt="Fresh Picks banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          <div className="relative z-10 text-center mt-14 text-white px-6">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-7xl font-extrabold mb-4"
            >
              Fresh Picks
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto leading-relaxed"
            >
              Explore this week’s freshest arrivals — organic, pure, and hand-selected just for you.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex justify-center"
            >
              <div className="flex w-full max-w-xl bg-white rounded-full shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search fresh organic picks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-3 text-gray-800 focus:outline-none"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 font-semibold transition-all">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* CONTENT AREA */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* SIDEBAR FILTERS */}
            <AnimatePresence>
              {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                <motion.aside
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="w-full lg:w-64 flex-shrink-0"
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sticky top-8 border border-green-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-green-600" /> Filters
                      </h3>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-green-600 hover:text-green-700 font-semibold"
                      >
                        Clear all
                      </button>
                    </div>

                    {/* Search Filter */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-gray-800">Price Range</h4>
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <label key={range.label} className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="priceRange"
                              checked={selectedPriceRange?.label === range.label}
                              onChange={() => setSelectedPriceRange(range)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            {range.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Brand Filter */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-gray-800">Brands</h4>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label key={brand} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            {brand}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">Certifications</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                          <Award className="w-4 h-4 text-green-600" /> Organic Certified
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
                          <Check className="w-4 h-4 text-blue-600" /> Gluten Free
                        </div>
                        <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                          <Leaf className="w-4 h-4 text-purple-600" /> Vegan
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* MAIN PRODUCT GRID */}
            <main className="flex-1">
              {/* Categories */}
              <div className="flex flex-wrap items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-green-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-gray-100 px-4 py-2 rounded-full hover:bg-green-50 text-gray-700"
                >
                  <Filter className="w-4 h-4 inline mr-2" /> Filters
                </button>
              </div>

              {/* Product Count */}
              <p className="text-gray-600 mb-4">
                Showing <span className="font-semibold">{filteredProducts.length}</span> products
              </p>

              {/* Product Cards */}
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden group relative"
                  >
                    <div className="relative h-60">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {p.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          -{p.discount}%
                        </div>
                      )}
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        className={`absolute top-3 left-3 p-2 rounded-full transition-all ${
                          favorites.includes(p.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-white/90 hover:bg-red-600 hover:text-white text-gray-700'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{p.rating}</span>
                        <span className="text-xs text-gray-500">({p.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-green-600 font-bold text-xl">
                            ₦{p.price.toLocaleString()}
                          </span>
                          {p.originalPrice && (
                            <span className="ml-2 text-gray-400 line-through text-sm">
                              ₦{p.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(p)}
                          className={`p-3 rounded-full transition-all ${
                            cart.includes(p.id)
                              ? 'bg-green-600 text-white scale-110'
                              : 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white'
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
