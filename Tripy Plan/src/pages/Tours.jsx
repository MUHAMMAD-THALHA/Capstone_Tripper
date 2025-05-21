import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaStar, FaFilter, FaSearch } from 'react-icons/fa';
import { toursAPI } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

const Tours = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch tours with search
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['tours', 'search', debouncedSearchQuery],
    queryFn: () => toursAPI.search(debouncedSearchQuery),
    retry: 1,
  });

  // Fetch all tours as fallback
  const { data: allTours, isLoading: toursLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: toursAPI.getAll,
    retry: 1,
    enabled: !debouncedSearchQuery
  });

  const tours = searchQuery ? searchResults : allTours;
  const isLoading = searchQuery ? searchLoading : toursLoading;

  // Filter tours based on category, difficulty, duration and price
  const filteredTours = tours?.filter(tour => {
    const matchesCategory = categoryFilter === 'all' || tour.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesDifficulty = difficultyFilter === 'all' || tour.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesDuration = durationFilter === 'all' || 
      (durationFilter === 'short' && parseInt(tour.duration) <= 3) ||
      (durationFilter === 'medium' && parseInt(tour.duration) > 3 && parseInt(tour.duration) <= 7) ||
      (durationFilter === 'long' && parseInt(tour.duration) > 7);
    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];
    
    return matchesCategory && matchesDifficulty && matchesDuration && matchesPrice;
  });

  // Get unique categories and difficulties from tours
  const categories = tours ? ['all', ...new Set(tours.map(tour => tour.category.toLowerCase()))] : ['all'];
  const difficulties = tours ? ['all', ...new Set(tours.map(tour => tour.difficulty.toLowerCase()))] : ['all'];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDurationFilter(e.target.value);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.name === 'minPrice') {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-peach py-8 px-4">
      <Helmet>
        <title>Tours - Tripy</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-darkpink mb-8">Explore Our Tours</h1>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search tours by name, location, category..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            
            <button
              onClick={toggleFilters}
              className="flex items-center gap-2 bg-pink text-white px-4 py-2 rounded-lg hover:bg-darkpink transition-colors"
            >
              <FaFilter /> Filters
            </button>
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  {categories.map((category, idx) => (
                    <option key={idx} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={handleDifficultyChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  {difficulties.map((difficulty, idx) => (
                    <option key={idx} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Duration</label>
                <select
                  value={durationFilter}
                  onChange={handleDurationChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                >
                  <option value="all">All</option>
                  <option value="short">Short (1-3 days)</option>
                  <option value="medium">Medium (4-7 days)</option>
                  <option value="long">Long (8+ days)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    value={priceRange[0]}
                    onChange={handlePriceChange}
                    min="0"
                    max={priceRange[1]}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    min={priceRange[0]}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink"></div>
          </div>
        ) : filteredTours?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white text-pink font-bold px-3 py-1 rounded-full">
                    ${tour.price}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{tour.title}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaMapMarkerAlt className="text-pink" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaClock className="text-pink" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FaStar className="text-yellow-400" />
                    <span>{tour.rating}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-peach text-darkpink rounded-full text-xs">
                        {tour.category}
                      </span>
                      <span className="px-2 py-1 bg-peach text-darkpink rounded-full text-xs">
                        {tour.difficulty}
                      </span>
                    </div>
                    <Link
                      to={`/tours/${tour.id}`}
                      className="bg-pink text-white font-bold px-4 py-2 rounded-lg hover:bg-darkpink transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-lg p-8">
            <p className="text-xl text-gray-600 mb-4">No tours found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setDifficultyFilter('all');
                setDurationFilter('all');
                setPriceRange([0, 10000]);
              }}
              className="bg-pink text-white px-6 py-2 rounded-lg hover:bg-darkpink transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours; 