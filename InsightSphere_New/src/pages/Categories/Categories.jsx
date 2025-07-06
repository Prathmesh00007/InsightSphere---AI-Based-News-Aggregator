import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

function CategoriesPage() {
  // State for categories and news articles.
  const [categories, setCategories] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // On mount, fetch categories.
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the backend.
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await api.get('/news/categories');
      console.log('Categories response:', response.data);
      
      // The API might return an array of objects or an array of strings.
      const categoriesData = Array.isArray(response.data)
        ? response.data
        : response.data.categories;
      
      if (!categoriesData) {
        console.error('No categories data in response:', response.data);
        toast.error('Invalid categories data received');
        return;
      }
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.response?.data?.detail || 'Failed to fetch categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Normalize categories so that each category is an object with id, name, and description.
  const normalizedCategories = categories.map((category) =>
    typeof category === 'string'
      ? { id: category, name: category, description: '' }
      : category
  );

  // Filter categories based on the search query.
  const filteredCategories = normalizedCategories.filter((category) =>
    (category.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch news articles for a given category.
  const fetchNewsByCategory = async (categoryId) => {
    try {
      setIsLoadingNews(true);
      const response = await api.get(`/news/category/${categoryId}`);
      setNewsArticles(response.data);
    } catch (error) {
      console.error('Error fetching news articles:', error);
      toast.error(error.response?.data?.detail || 'Failed to fetch news articles');
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Handle category click: set the selected category and load its news.
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchNewsByCategory(category.id);
  };

  // Returns a background image URL based on the category name.
  // For example, it uses Unsplash's dynamic image endpoint with specific queries.
  const getCategoryBackground = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('politics'))
      return "url('https://source.unsplash.com/500x300/?politics')";
    if (lowerName.includes('sports'))
      return "url('https://source.unsplash.com/500x300/?sports')";
    if (lowerName.includes('business'))
      return "url('https://source.unsplash.com/500x300/?business')";
    if (lowerName.includes('entertainment'))
      return "url('https://source.unsplash.com/500x300/?entertainment')";
    if (lowerName.includes('technology'))
      return "url('https://source.unsplash.com/500x300/?technology')";
    if (lowerName.includes('health'))
      return "url('https://source.unsplash.com/500x300/?health')";
    // Default background
    return "url('https://source.unsplash.com/500x300/?news')";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">News Categories</h1>
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>
      </motion.div>

      {/* Categories List */}
      {isLoadingCategories ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg sm:text-xl">Loading categories...</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
        >
          {filteredCategories.map((category, index) => (
            <motion.div
              key={index}
              onClick={() => handleCategoryClick(category)}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{
                backgroundImage: getCategoryBackground(category.name),
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="p-6 bg-white bg-opacity-50 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category.name}</h2>
                <p className="text-gray-600 mb-4">
                  {category.description || 'Explore more news in this category.'}
                </p>
                <p className="inline-block text-blue-600 hover:text-blue-800 font-medium">
                  Explore More &rarr;
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* News Articles Section */}
      {selectedCategory && (
        <div className="mt-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-6"
          >
            News in "{selectedCategory.name}"
          </motion.h2>
          {isLoadingNews ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-lg">Loading news...</p>
            </div>
          ) : newsArticles && newsArticles.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {newsArticles.map((news) => (
                <motion.div
                  key={news._id || news.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 sm:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{news.title}</h3>
                  <p className="text-gray-700 mb-3 text-sm sm:text-base line-clamp-3">
                    {news.description || 'No description available'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3">
                    {new Date(news.published_at).toLocaleString()}
                  </p>
                  {news.url && (
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base inline-block"
                    >
                      Read more
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No news found for this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
