import React from 'react';

const CategoryShowcase = () => {
  const categories = [
    {
      title: "Fresh Produce Daily",
      items: [
        {
          name: "Fresh Fruits",
          image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-100 to-yellow-100"
        },
        {
          name: "Fresh Vegetables",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-green-100 to-emerald-100"
        },
        {
          name: "Organic Greens",
          image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-lime-100 to-green-100"
        },
        {
          name: "Herbs & Spices",
          image: "https://images.unsplash.com/photo-1596040033229-a0b531c8fc4c?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-green-50 to-teal-100"
        }
      ],
      link: "See more",
      linkColor: "text-green-600 hover:text-green-700"
    },
    {
      title: "Pantry Essentials",
      items: [
        {
          name: "Rice & Grains",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-100 to-orange-100"
        },
        {
          name: "Pasta & Noodles",
          image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-yellow-100 to-amber-100"
        },
        {
          name: "Cooking Oils",
          image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50"
        },
        {
          name: "Canned Foods",
          image: "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-red-100 to-orange-100"
        }
      ],
      link: "Discover more",
      linkColor: "text-orange-600 hover:text-orange-700"
    },
    {
      title: "Dairy & Breakfast",
      items: [
        {
          name: "Fresh Milk",
          image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100"
        },
        {
          name: "Cheese Selection",
          image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100"
        },
        {
          name: "Eggs",
          image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50"
        },
        {
          name: "Cereals",
          image: "https://images.unsplash.com/photo-1590137876181-0c6e83fa7adb?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-100 to-red-100"
        }
      ],
      link: "See more",
      linkColor: "text-blue-600 hover:text-blue-700"
    },
    {
      title: "Snacks & Beverages",
      items: [
        {
          name: "Fresh Juices",
          image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-orange-100 to-pink-100"
        },
        {
          name: "Chips & Crisps",
          image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-red-100 to-orange-100"
        },
        {
          name: "Cookies & Biscuits",
          image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-amber-100 to-yellow-100"
        },
        {
          name: "Soft Drinks",
          image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=400&fit=crop",
          bgColor: "bg-gradient-to-br from-blue-100 to-purple-100"
        }
      ],
      link: "Discover more",
      linkColor: "text-purple-600 hover:text-purple-700"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.title}
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {category.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="cursor-pointer group/item"
                  >
                    <div className={`${item.bgColor} rounded-xl overflow-hidden mb-2 aspect-square transform group-hover/item:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl`}>
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:opacity-90 transition-opacity"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 text-center group-hover/item:text-green-600 transition-colors">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
              
              <a 
                href="#" 
                className={`inline-flex items-center font-semibold ${category.linkColor} transition-all group-hover:gap-3 gap-2`}
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