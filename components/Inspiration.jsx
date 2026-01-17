'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const inspirationImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800',
    title: 'Authentic Jollof Rice',
    description: 'Traditional Nigerian Jollof with premium ingredients',
    products: ['Optimum Rice', 'Fresh Tomatoes', 'Red Peppers', 'Spices'],
    ctaText: 'Shop Jollof Ingredients',
    ctaLink: '/category/grains',
    aspect: 'portrait',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=800',
    title: 'Fresh Nigerian Soups',
    description: 'Egusi, Ogbono, and Bitter Leaf soup essentials',
    products: ['Fresh Vegetables', 'Palm Oil', 'Stockfish', 'Crayfish'],
    ctaText: 'Shop Soup Ingredients',
    ctaLink: '/category/soups-condiments',
    aspect: 'landscape',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=800',
    title: 'Premium Fish & Seafood',
    description: 'Fresh catch and quality frozen options',
    products: ['Feenah Sardines', 'Fresh Fish', 'Prawns', 'Stockfish'],
    ctaText: 'Browse Seafood',
    ctaLink: '/category/proteins/fish-and-seafoods',
    aspect: 'portrait',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800',
    title: 'Fresh Farm Vegetables',
    description: 'Locally sourced fresh produce delivered daily',
    products: ['Tomatoes', 'Peppers', 'Onions', 'Spinach'],
    ctaText: 'Shop Fresh Produce',
    ctaLink: '/category/fresh-produce',
    aspect: 'landscape',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800',
    title: 'Quality Meats & Poultry',
    description: 'Premium cuts of beef, chicken, and goat meat',
    products: ['Fresh Chicken', 'Beef', 'Goat Meat', 'Turkey'],
    ctaText: 'Shop Meats',
    ctaLink: '/category/proteins/meats-and-poultry',
    aspect: 'portrait',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800',
    title: 'Spices & Seasonings',
    description: 'Authentic flavors from herbs to traditional spices',
    products: ['Fenugreek', 'Cumin Seeds', 'Black Seeds', 'Dried Mushroom'],
    ctaText: 'Explore Spices',
    ctaLink: '/category/pantry/herbs-spices-and-seasonings',
    aspect: 'landscape',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800',
    title: 'Oils & Essential Cooking Oils',
    description: 'Palm oil, groundnut oil, and specialty oils',
    products: ['Power Oil', 'Banga Oil', 'Groundnut Oil', 'Olive Oil'],
    ctaText: 'Shop Cooking Oils',
    ctaLink: '/category/oils',
    aspect: 'portrait',
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
    title: 'Staples & Tubers',
    description: 'Yam, cassava, plantain and other Nigerian staples',
    products: ['Irish Potatoes', 'Sweet Potatoes', 'Yam', 'Plantain'],
    ctaText: 'Browse Staples',
    ctaLink: '/category/staples-and-tubers',
    aspect: 'portrait',
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800',
    title: 'Bakery & Breakfast',
    description: 'Start your day with fresh baked goods',
    products: ['Bread', 'Eggs', 'Heinz Ketchup', 'Cereals'],
    ctaText: 'Breakfast Items',
    ctaLink: '/category/breakfast-beverages',
    aspect: 'landscape',
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800',
    title: 'Dairy & Eggs',
    description: 'Fresh dairy products and farm eggs',
    products: ['Fresh Eggs', 'Milk', 'Cheese', 'Butter'],
    ctaText: 'Shop Dairy',
    ctaLink: '/category/dairy-cheese-and-eggs',
    aspect: 'portrait',
  },
];

export default function InspirationGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef(null);
  const itemRefs = useRef([]);

  // scroll to a specific card
  const scrollToImage = (index) => {
    const node = itemRefs.current[index];
    if (node && scrollerRef.current) {
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCurrentIndex(index);
    }
  };

  const nextImage = () => {
    scrollToImage((currentIndex + 1) % inspirationImages.length);
  };

  const prevImage = () => {
    scrollToImage((currentIndex - 1 + inspirationImages.length) % inspirationImages.length);
  };

  // Keep track of which card is centered using IntersectionObserver
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const options = {
      root: scroller,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-index'));
          setCurrentIndex(index);
        }
      });
    }, options);

    itemRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-green-600 uppercase tracking-wider mb-2 font-semibold">
            Recipe Ideas & Inspiration
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            COOK AUTHENTIC NIGERIAN MEALS
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get inspired by traditional recipes and discover quality ingredients for your favorite dishes
          </p>
        </div>

        {/* Gallery */}
        <div className="relative">
          {/* Desktop arrows */}
          <button
            onClick={prevImage}
            aria-label="Previous"
            className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>

          <button
            onClick={nextImage}
            aria-label="Next"
            className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-md hover:bg-white transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-900" />
          </button>

          {/* Scroll container */}
          <div
            ref={scrollerRef}
            className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:px-0"
            role="list"
            aria-label="Inspiration gallery"
          >
            <div className="flex gap-4 pb-4 items-stretch snap-x snap-mandatory">
              {inspirationImages.map((item, idx) => (
                <div
                  key={item.id}
                  data-index={idx}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  className={`relative flex-shrink-0 group cursor-pointer snap-center rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow
                    ${item.aspect === 'portrait' ? 'w-[260px] h-[390px] md:w-[300px] md:h-[450px]' : 'w-[340px] h-[240px] md:w-[400px] md:h-[300px]'}
                  `}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Always-visible badge */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <p className="text-xs font-bold text-gray-900 leading-4">{item.title}</p>
                    <p className="text-xs text-green-600 leading-4 font-semibold">{item.products.length} ingredients</p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-5 text-white text-center">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm md:text-base text-gray-100 mb-4 max-w-[260px]">{item.description}</p>

                    <div className="mb-4 flex flex-wrap gap-2 justify-center">
                      {item.products.slice(0, 4).map((p, i) => (
                        <span key={i} className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                          {p}
                        </span>
                      ))}
                    </div>

                    <a 
                      href={item.ctaLink} 
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-green-700 transition-all shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm">{item.ctaText}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {inspirationImages.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToImage(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`rounded-full transition-all ${i === currentIndex ? 'bg-green-600 w-6 h-2' : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a 
            href="/shop" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg"
          >
            Explore All Products
          </a>
          <p className="mt-4 text-sm text-gray-500">
            Free shipping on orders over ₦29,999
          </p>
        </div>
      </div>

      {/* small helper styles (scoped) */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}