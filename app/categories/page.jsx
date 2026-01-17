'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Sparkles, Search, SlidersHorizontal, X, Grid3x3, List, TrendingUp, Package, Clock, Leaf, Heart, Star, ArrowUpDown, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = [
  {
    id: 1,
    name: 'Fruits & Vegetables',
    description: 'Fresh, organic and locally sourced produce.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800',
    count: 122,
    trending: true,
    icon: '🥬',
    color: 'from-green-500 to-emerald-600',
    featured: true
  },
  {
    id: 2,
    name: 'Bakery & Pastries',
    description: 'Artisan breads, cakes, and delicious pastries.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800',
    count: 87,
    trending: false,
    icon: '🍞',
    color: 'from-amber-500 to-orange-600',
    featured: true
  },
  {
    id: 3,
    name: 'Dairy & Eggs',
    description: 'Wholesome dairy products and fresh eggs.',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=800',
    count: 64,
    trending: true,
    icon: '🥛',
    color: 'from-blue-400 to-cyan-600',
    featured: false
  },
  {
    id: 4,
    name: 'Snacks & Beverages',
    description: 'Healthy drinks, juices, and crunchy delights.',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800',
    count: 133,
    trending: true,
    icon: '🥤',
    color: 'from-purple-500 to-pink-600',
    featured: true
  },
  {
    id: 5,
    name: 'Grains & Cereals',
    description: 'Rice, oats, flour and nutritious grains.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
    count: 56,
    trending: false,
    icon: '🌾',
    color: 'from-yellow-600 to-amber-700',
    featured: false
  },
  {
    id: 6,
    name: 'Spices & Condiments',
    description: 'Add rich flavor and aroma to your meals.',
    image: 'https://images.unsplash.com/photo-1596040033229-a0b13f34e43a?q=80&w=800',
    count: 98,
    trending: false,
    icon: '🌶️',
    color: 'from-red-500 to-rose-600',
    featured: true
  },
  {
    id: 7,
    name: 'Frozen Foods',
    description: 'Ready-to-cook frozen meals and vegetables.',
    image: 'https://images.unsplash.com/photo-1476124369491-f7addf5dd2f8?q=80&w=800',
    count: 72,
    trending: false,
    icon: '❄️',
    color: 'from-cyan-500 to-blue-600',
    featured: false
  },
  {
    id: 8,
    name: 'Meat & Poultry',
    description: 'High-quality, tender cuts and organic meats.',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=800',
    count: 45,
    trending: true,
    icon: '🥩',
    color: 'from-red-600 to-red-700',
    featured: true
  },
  {
    id: 9,
    name: 'Seafood',
    description: 'Fresh fish and premium seafood selection.',
    image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?q=80&w=800',
    count: 38,
    trending: true,
    icon: '🐟',
    color: 'from-blue-500 to-indigo-600',
    featured: false
  },
  {
    id: 10,
    name: 'Organic & Health',
    description: 'Certified organic and health-focused products.',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=800',
    count: 91,
    trending: true,
    icon: '🌱',
    color: 'from-green-600 to-teal-600',
    featured: true
  },
  {
    id: 11,
    name: 'Baby & Kids',
    description: 'Nutritious food and essentials for little ones.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800',
    count: 53,
    trending: false,
    icon: '👶',
    color: 'from-pink-400 to-rose-500',
    featured: false
  },
  {
    id: 12,
    name: 'Household Essentials',
    description: 'Cleaning supplies and home care products.',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=800',
    count: 67,
    trending: false,
    icon: '🧹',
    color: 'from-gray-500 to-slate-600',
    featured: false
  }
];

const quickFilters = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'featured', label: 'Featured', icon: Star },
  { id: 'new', label: 'New Arrivals', icon: Sparkles },
  { id: 'organic', label: 'Organic', icon: Leaf }
];

export default function ExploreCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [selectedFilter, searchQuery, sortBy]);

  const filteredCategories = categories
    .filter(cat => {
      if (searchQuery) {
        return cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (selectedFilter === 'trending') return cat.trending;
      if (selectedFilter === 'featured') return cat.featured;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.count - a.count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'items-low') return a.count - b.count;
      if (sortBy === 'items-high') return b.count - a.count;
      return 0;
    });

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

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
        
        <div className="relative max-w-7xl mx-auto px-6 mt-5 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">Discover Fresh Choices</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Explore Our Categories
              </h1>
              
              <p className="text-xl text-green-50 leading-relaxed">
                Discover all you need — from farm-fresh produce to pantry staples and healthy snacks.  
                Filter by price, brand, or preference to find exactly what you love.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-xs text-green-100">Categories</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-xs text-green-100">Products</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <div className="text-2xl font-bold">2hr</div>
                      <div className="text-xs text-green-100">Delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800"
                  alt="Explore groceries"
                  className="rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Leaf className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Fresh Quality</div>
                      <div className="text-sm text-gray-600">Farm to Table</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-2xl w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
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
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm font-semibold cursor-pointer hover:bg-gray-200 focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="name">Name A-Z</option>
                <option value="items-high">Most Items</option>
                <option value="items-low">Fewest Items</option>
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
            <button
              onClick={() => setSelectedFilter('all')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                selectedFilter === 'all'
                  ? 'bg-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              All Categories
            </button>
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                    selectedFilter === filter.id
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

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-green-600" />
            Browse Categories
            <span className="text-sm font-normal text-gray-500">
              ({filteredCategories.length} found)
            </span>
          </h2>
        </div>

        {/* Categories Grid/List */}
        <div className={`${isAnimating ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}>
          {viewMode === 'grid' ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                    
                    {/* Category Icon */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                      <span className="text-2xl">{cat.icon}</span>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {cat.trending && (
                        <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </div>
                      )}
                      {cat.featured && (
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(cat.id);
                      }}
                      className={`absolute bottom-4 right-4 p-2 rounded-full transition-all ${
                        favorites.includes(cat.id)
                          ? 'bg-red-600 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-red-600 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(cat.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-between group-hover:text-green-600 transition-colors">
                      {cat.name}
                      <ChevronRight className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {cat.count} items
                      </span>
                      <button className="text-green-600 font-semibold text-sm hover:text-green-700 flex items-center gap-1 group/btn">
                        Shop now
                        <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className="flex items-center gap-6 p-6">
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                        <span className="text-xl">{cat.icon}</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-gray-600">{cat.description}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(cat.id);
                          }}
                          className={`p-2 rounded-full transition-all ${
                            favorites.includes(cat.id)
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(cat.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex gap-2">
                          {cat.trending && (
                            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </div>
                          )}
                          {cat.featured && (
                            <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Featured
                            </div>
                          )}
                        </div>
                        <span className="text-gray-500">{cat.count} items</span>
                        <button className="ml-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center gap-2">
                          Shop now
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {quickFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setSelectedFilter(filter.id);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        selectedFilter === filter.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
}