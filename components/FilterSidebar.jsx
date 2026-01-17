'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, Search, Leaf, Star, Truck, Tag, Filter
} from 'lucide-react';

const BRANDS = [
  'Dangote Foods', 'Golden Penny', 'Honeywell', 'Chi Limited',
  'Indomie', 'Nestle Nigeria', 'PZ Cussons', 'Dufil Prima',
  'Flour Mills', 'Cadbury Nigeria', 'Top Tea'
];

const FARM_TYPES = [
  { name: 'Organic Farms', color: '#10B981', checked: false },
  { name: 'Local Farms', color: '#F59E0B', checked: true },
  { name: 'Imported', color: '#3B82F6', checked: false },
];

const DIETARY_OPTIONS = [
  'Organic', 'Gluten-Free', 'Vegan', 'Halal', 'Kosher',
  'Non-GMO', 'Low Sugar', 'High Protein'
];

const CATEGORY_OPTIONS = [
  'Fruits & Vegetables', 'Meat & Poultry', 'Seafood',
  'Dairy & Eggs', 'Bakery', 'Beverages', 'Snacks',
  'Frozen Foods', 'Grains & Pasta', 'Spices & Condiments'
];

export default function FilterSidebar({ onChange } = {}) {
  const [open, setOpen] = useState({
    price: true, brand: true, dietary: false, category: false,
    freshness: false, delivery: false, discount: false, rating: false
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [brandQuery, setBrandQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [freshnessOnly, setFreshnessOnly] = useState(false);
  const [sameDayDelivery, setSameDayDelivery] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const filteredBrands = useMemo(
    () => BRANDS.filter(b => b.toLowerCase().includes(brandQuery.trim().toLowerCase())),
    [brandQuery]
  );

  const toggleSection = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }));
  const toggleBrand = (brand) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  const toggleDietary = (option) =>
    setSelectedDietary((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  const toggleCategory = (category) =>
    setSelectedCategory((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

  const handleApply = () => {
    onChange &&
      onChange({
        price: [minPrice, maxPrice],
        brands: selectedBrands,
        dietary: selectedDietary,
        category: selectedCategory,
        freshness: freshnessOnly,
        sameDayDelivery,
        onSaleOnly,
        rating: minRating,
      });
  };

  const handleClear = () => {
    setMinPrice(0);
    setMaxPrice(50000);
    setSelectedBrands([]);
    setSelectedDietary([]);
    setSelectedCategory([]);
    setBrandQuery('');
    setFreshnessOnly(false);
    setSameDayDelivery(false);
    setOnSaleOnly(false);
    setMinRating(0);
    onChange && onChange(null);
  };

  const Section = ({ title, icon: Icon, sectionKey, children }) => (
    <div className="border-b border-gray-100 pb-4 mb-5">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full group"
      >
        <span className="flex items-center gap-2 text-gray-700 font-medium">
          {Icon && <Icon className="w-4 h-4 text-green-600" />}
          {title}
        </span>
        {open[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mt-3 space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <aside className="w-72 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">
          {selectedBrands.length + selectedDietary.length + selectedCategory.length} active
        </span>
      </div>

      {/* Price */}
      <Section title="Price Range (₦)" sectionKey="price">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>₦0</span> <span>₦50,000+</span>
        </div>
        <div className="relative mt-2 h-6">
          <input
            type="range"
            min="0"
            max="50000"
            step="500"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(Math.min(Number(e.target.value), maxPrice))
            }
            className="w-full h-1 accent-green-600 bg-gray-200 rounded-lg appearance-none"
          />
          <input
            type="range"
            min="0"
            max="50000"
            step="500"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(Math.max(Number(e.target.value), minPrice))
            }
            className="w-full h-1 accent-green-600 absolute top-0 bg-transparent appearance-none"
          />
        </div>
        <div className="flex gap-3 text-xs mt-2 text-gray-600">
          <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
            From ₦{minPrice.toLocaleString()}
          </span>
          <span className="px-3 py-1 bg-gray-50 rounded-full border border-gray-200">
            To ₦{maxPrice.toLocaleString()}
          </span>
        </div>
      </Section>

      {/* Brand */}
      <Section title="Brand" sectionKey="brand">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={brandQuery}
            onChange={(e) => setBrandQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="max-h-44 overflow-y-auto pr-2 custom-scrollbar">
          {filteredBrands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-3 py-2 hover:bg-gray-50 rounded px-1 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="w-4 h-4 text-green-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{b}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category" sectionKey="category">
        {CATEGORY_OPTIONS.map((cat) => (
          <label
            key={cat}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded px-1 py-1"
          >
            <input
              type="checkbox"
              checked={selectedCategory.includes(cat)}
              onChange={() => toggleCategory(cat)}
              className="w-4 h-4 rounded border-gray-300 text-green-600"
            />
            <span className="text-sm text-gray-700">{cat}</span>
          </label>
        ))}
      </Section>

      {/* Dietary */}
      <Section title="Dietary" sectionKey="dietary">
        {DIETARY_OPTIONS.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded px-1 py-1 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedDietary.includes(opt)}
              onChange={() => toggleDietary(opt)}
              className="w-4 h-4 text-green-600 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">{opt}</span>
            {opt === 'Organic' && (
              <Leaf className="w-3 h-3 text-green-600 ml-auto" />
            )}
          </label>
        ))}
      </Section>

      {/* Freshness */}
      <Section title="Freshness" sectionKey="freshness" icon={Leaf}>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded px-1 py-2">
          <input
            type="checkbox"
            checked={freshnessOnly}
            onChange={() => setFreshnessOnly(!freshnessOnly)}
            className="w-4 h-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Fresh produce only</span>
        </label>
      </Section>

      {/* Delivery */}
      <Section title="Delivery" sectionKey="delivery" icon={Truck}>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded px-1 py-2">
          <input
            type="checkbox"
            checked={sameDayDelivery}
            onChange={() => setSameDayDelivery(!sameDayDelivery)}
            className="w-4 h-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Same-day delivery</span>
        </label>
      </Section>

      {/* Special Offers */}
      <Section title="Special Offers" sectionKey="discount" icon={Tag}>
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded px-1 py-2">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={() => setOnSaleOnly(!onSaleOnly)}
            className="w-4 h-4 text-green-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">On sale only</span>
          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            Sale
          </span>
        </label>
      </Section>

      {/* Rating */}
      <Section title="Customer Rating" sectionKey="rating" icon={Star}>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === star}
                onChange={() => setMinRating(star)}
                className="hidden"
              />
              <Star
                className={`w-5 h-5 ${
                  minRating >= star ? 'text-yellow-400' : 'text-gray-300'
                } transition-colors`}
              />
            </label>
          ))}
          <span className="text-xs text-gray-500 ml-2">and up</span>
        </div>
      </Section>

      {/* Apply & Clear */}
      <div className="mt-6 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleApply}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm transition-all"
        >
          Apply Filters
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClear}
          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-lg text-sm font-medium text-gray-700 transition-colors"
        >
          Clear
        </motion.button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </aside>
  );
}
