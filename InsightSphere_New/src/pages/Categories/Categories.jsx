// CategoriesPage.jsx
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

  // Normalize categories so that each category is an object
  // with id, name, and description.
  const normalizedCategories = categories.map((category) =>
    typeof category === 'string'
      ? { id: category, name: category, description: '' }
      : category
  );

  // Filter categories based on the search query.
  const filteredCategories = normalizedCategories.filter((category) =>
    (category.name || "").toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-4">News Categories</h1>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </motion.div>

      {/* Categories List */}
      {isLoadingCategories ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading categories...</div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.03 }}
              className={`p-2 border cursor-pointer rounded text-center ${
                selectedCategory && selectedCategory.id === category.id
                  ? 'bg-blue-200'
                  : 'bg-white'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <p className="font-medium">{category.name}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* News Articles Section */}
      {selectedCategory && (
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold mb-4"
          >
            News in "{selectedCategory.name}"
          </motion.h2>
          {isLoadingNews ? (
            <p>Loading news...</p>
          ) : newsArticles && newsArticles.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-4"
            >
              {newsArticles.map((news) => (
                <motion.div
                  key={news._id || news.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                  <p className="text-gray-700 mb-2">{news.description || 'No description available'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(news.published_at).toLocaleString()}
                  </p>
                  {news.url && (
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Read more
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p>No news found for this category.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
