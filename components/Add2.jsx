import React from 'react';

const CategoryShowcase = () => {
  const categories = [
    {
      title: "Farm Fresh Vegetables",
      items: [
        {
          name: "Potatoes",
          image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-50 to-orange-100"
        },
        {
          name: "Carrots",
          image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-100 to-red-100"
        },
        {
          name: "Yams",
          image: "https://images.unsplash.com/photo-1572041002099-b1c4d5d8276f?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-100 to-yellow-100"
        },
        {
          name: "Sweet Potatoes",
          image: "https://images.unsplash.com/photo-1589927986089-35812378d10d?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-50 to-amber-100"
        }
      ],
      link: "See more",
      linkColor: "text-orange-600 hover:text-orange-700"
    },
    {
      title: "Fresh Fish & Seafood",
      items: [
        {
          name: "Fresh Fish",
          image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100"
        },
        {
          name: "Prawns",
          image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-pink-100 to-orange-100"
        },
        {
          name: "Crabs",
          image: "https://images.unsplash.com/photo-1608208597112-919903f20f56?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-red-100 to-orange-100"
        },
        {
          name: "Shellfish",
          image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-cyan-100 to-blue-100"
        }
      ],
      link: "See more",
      linkColor: "text-blue-600 hover:text-blue-700"
    },
    {
      title: "Quality Meats & Poultry",
      items: [
        {
          name: "Chicken",
          image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-50 to-yellow-100"
        },
        {
          name: "Beef",
          image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-red-100 to-pink-100"
        },
        {
          name: "Turkey",
          image: "https://images.unsplash.com/photo-1629944453655-5c2c5b6f5ecd?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-100 to-amber-100"
        },
        {
          name: "Lamb",
          image: "https://images.unsplash.com/photo-1558030089-6e1f66035a84?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-red-50 to-orange-100"
        }
      ],
      link: "Shop now",
      linkColor: "text-red-600 hover:text-red-700"
    },
    {
      title: "Bakery & Fresh Bread",
      items: [
        {
          name: "Fresh Bread",
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-100 to-orange-100"
        },
        {
          name: "Pastries",
          image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-yellow-100 to-amber-100"
        },
        {
          name: "Cakes",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-pink-100 to-purple-100"
        },
        {
          name: "Cookies",
          image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-50 to-amber-100"
        }
      ],
      link: "Explore all in Bakery",
      linkColor: "text-amber-600 hover:text-amber-700"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group border border-gray-100"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                {category.title}
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                {category.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="cursor-pointer group/item"
                  >
                    <div className={`${item.bgColor} rounded-xl overflow-hidden mb-2 aspect-square transform group-hover/item:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg`}>
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:opacity-90 transition-opacity"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-800 group-hover/item:text-green-600 transition-colors">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
              
              <a 
                href="#" 
                className={`inline-flex items-center font-semibold text-sm ${category.linkColor} transition-all group-hover:gap-3 gap-2`}
              >
                {category.link}
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;