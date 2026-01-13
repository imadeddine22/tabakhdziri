'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import FeaturedSection from '@/components/FeaturedSection';
import CategoryFilter from '@/components/CategoryFilter';
import RestaurantGrid from '@/components/RestaurantGrid';
import { getDishes, getCategories, productsAPI } from '@/lib/api';
import { smartSearch } from '@/lib/search';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Ref for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        console.log('🚀 Starting data fetch...');

        const [dishesData, categoriesData, featuredData] = await Promise.all([
          getDishes(),
          getCategories(),
          productsAPI.getFeatured()
        ]);

        console.log('✅ Data fetched successfully!');
        console.log('  📦 Dishes:', dishesData?.length || 0, dishesData);
        console.log('  📂 Categories:', categoriesData?.length || 0, categoriesData);
        console.log('  ⭐ Featured:', featuredData);

        setDishes(dishesData || []);
        setFilteredDishes(dishesData || []);
        // Use featured products from API
        setFeaturedDishes(featuredData || []);
        setCategories(categoriesData || []);

        console.log('✅ State updated!');
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter dishes based on category and search
  useEffect(() => {
    let filtered = dishes;

    if (selectedCategory) {
      console.log('🔍 Filtering by category:', selectedCategory);
      console.log('📦 All dishes:', dishes);

      filtered = filtered.filter((d: any) => {
        // Handle both object and string category formats
        const dishCategory = typeof d.category === 'object' ? d.category : null;
        const categoryId = dishCategory?._id || dishCategory?.id;
        const categoryName = dishCategory?.name;

        console.log('  🍽️ Dish:', d.name, '| Category:', categoryName, '| ID:', categoryId);

        // Match by ID or name
        return categoryId === selectedCategory ||
          categoryName === selectedCategory ||
          d.category === selectedCategory;
      });

      console.log('✅ Filtered dishes:', filtered.length, filtered);
    }

    if (searchQuery) {
      filtered = filtered.filter((d: any) =>
        smartSearch(d, searchQuery, ['name', 'description', 'category', 'type', 'name_ar', 'description_ar'])
      );
    }

    setFilteredDishes(filtered);

    // Auto-scroll to results when search query or category changes
    if ((searchQuery || selectedCategory) && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [selectedCategory, searchQuery, dishes]);

  const handleSearch = ({ query }: any) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-300">
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6 animate-pulse">
              <Image
                src="/logo.png"
                alt="Tabakh Dziri Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-2xl font-semibold text-gray-800">Loading...</p>
          </div>
        </div>
      )}
      <Hero onSearch={handleSearch} />
      <FeaturedSection dishes={featuredDishes} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <div ref={resultsRef}>
        <RestaurantGrid dishes={filteredDishes} />
      </div>
    </div>
  );
}
