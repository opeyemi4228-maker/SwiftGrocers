'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ChevronRight, Sparkles, Search, 
  X, Grid3x3, List, TrendingUp, Package, 
  Clock, Leaf, SlidersHorizontal, Filter, ArrowUpDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProducts } from '@/lib/products';

const quickFilters = [
  { id: 'all', label: 'All Products', icon: Package },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'sale', label: 'On Sale', icon: Sparkles },
  { id: 'organic', label: 'Organic', icon: Leaf },
  { id: 'fresh', label: 'Fresh Today', icon: Clock }
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' }
];

export default function ShopPage() {
  const { products, fetchProducts } = useProducts();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [advancedFilters, setAdvancedFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await fetchProducts();
      setAllProducts(data);
      setFilteredProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Apply all filters
  useEffect(() => {
    let result = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      );
    }

    // Quick filters
    if (selectedQuickFilter !== 'all') {
      switch (selectedQuickFilter) {
        case 'trending':
          result = result.filter((p) => p.rating >= 4.5);
          break;
        case 'sale':
          result = result.filter((p) => p.onSale);
          break;
        case 'organic':
          result = result.filter((p) => p.isOrganic || p.tags?.includes('organic'));
          break;
        case 'fresh':
          result = result.filter((p) => p.isFresh);
          break;
      }
    }

    // Advanced filters from sidebar
    if (advancedFilters) {
      // Price range
      if (advancedFilters.price) {
        const [min, max] = advancedFilters.price;
        result = result.filter((p) => p.price >= min && p.price <= max);
      }

      // Brands
      if (advancedFilters.brands?.length > 0) {
        result = result.filter((p) =>
          advancedFilters.brands.includes(p.brand)
        );
      }

      // Categories
      if (advancedFilters.category?.length > 0) {
        result = result.filter((p) =>
          advancedFilters.category.some((c) =>
            p.category?.toLowerCase().includes(c.toLowerCase())
          )
        );
      }

      // Dietary
      if (advancedFilters.dietary?.length > 0) {
        result = result.filter((p) =>
          advancedFilters.dietary.every((d) =>
            p.tags?.includes(d.toLowerCase())
          )
        );
      }

      // Freshness
      if (advancedFilters.freshness) {
        result = result.filter((p) => p.isFresh);
      }

      // On Sale
      if (advancedFilters.onSaleOnly) {
        result = result.filter((p) => p.onSale);
      }

      // Same day delivery
      if (advancedFilters.sameDayDelivery) {
        result = result.filter((p) => p.deliveryTime === '2-4 hours');
      }

      // Rating
      if (advancedFilters.rating > 0) {
        result = result.filter((p) => p.rating >= advancedFilters.rating);
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.reverse();
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedQuickFilter, advancedFilters, sortBy, allProducts]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedQuickFilter('all');
    setAdvancedFilters(null);
    setSortBy('popular');
  };

  const activeFiltersCount = 
    (searchQuery ? 1 : 0) +
    (selectedQuickFilter !== 'all' ? 1 : 0) +
    (advancedFilters?.brands?.length || 0) +
    (advancedFilters?.category?.length || 0) +
    (advancedFilters?.dietary?.length || 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
        {/* Hero Header */}
        <section className="relative bg-gradient-to-r from-green-600 to-emerald-700 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 mt-20 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold">Shop Fresh & Quality</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  All Products
                </h1>

                <p className="text-xl text-green-50 leading-relaxed">
                  Browse our complete collection of fresh groceries, quality meats, 
                  organic produce, and everyday essentials — all at great prices with 
                  fast delivery to your doorstep.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      <div>
                        <div className="text-2xl font-bold">{allProducts.length}+</div>
                        <div className="text-xs text-green-100">Products</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <div>
                        <div className="text-2xl font-bold">2hr</div>
                        <div className="text-xs text-green-100">Fast Delivery</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5" />
                      <div>
                        <div className="text-2xl font-bold">Fresh</div>
                        <div className="text-xs text-green-100">Daily Stock</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800"
                  alt="Shop groceries"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Free Shipping</div>
                      <div className="text-sm text-gray-600">Orders over ₦29,999</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-2xl w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Toggle Sidebar (Desktop) */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showSidebar ? 'Hide' : 'Show'} Filters
                </button>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 focus:outline-none"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${
                      viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all ${
                      viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Quick Filters */}
          <div className="mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedQuickFilter(filter.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedQuickFilter === filter.id
                        ? 'bg-green-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600 font-medium">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active:
              </span>
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-green-600" />
              All Products
              <span className="text-sm font-normal text-gray-500">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
              </span>
            </h2>
          </div>

          {/* Products Grid with Sidebar */}
          <div className="flex gap-8">
            {/* Sidebar */}
            {showSidebar && (
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <FilterSidebar onChange={setAdvancedFilters} />
              </aside>
            )}

            {/* Products */}
            <main className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {filteredProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowMobileFilters(false)}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <FilterSidebar onChange={(filters) => {
                  setAdvancedFilters(filters);
                  setShowMobileFilters(false);
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}