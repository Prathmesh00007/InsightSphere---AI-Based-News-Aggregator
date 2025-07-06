import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

function Home() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchLatestNews();
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  };

  const fetchLatestNews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/news/latest');
      setArticles(response.data);
    } catch (error) {
      toast.error('Failed to fetch latest news');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewNews = async (article) => {
    if (!user) {
      toast.error('Please login to view news!');
      return;
    }
    window.open(article.url, '_blank');
  };

  const handleSaveNews = async (article) => {
    if (!user) {
      toast.error('Please login to save news!');
      return;
    }
    try {
      await api.post('/news/save', { articleId: article.id });
      toast.success('Article saved successfully!');
    } catch (error) {
      toast.error('Failed to save article');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xl">Loading latest news...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4">
          InsightSphere
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 italic">
          Discover What Matters, Tailored Just for You
        </p>
      </motion.div>

      {articles.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-12 overflow-hidden rounded-xl shadow-lg"
        >
          {articles[0].urlToImage && (
            <img 
              src={articles[0].urlToImage} 
              className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-300 hover:scale-105" 
              alt="Featured News" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {articles[0].title}
              </h2>
              <p className="text-gray-200 text-sm sm:text-base line-clamp-2">
                {articles[0].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Latest News</h2>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {article.urlToImage && (
              <div className="relative h-48 sm:h-56">
                <img 
                  src={article.urlToImage} 
                  alt={article.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
                {article.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleViewNews(article)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  Read More
                </button>
                <button
                  onClick={() => handleSaveNews(article)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
                >
                  Save Post
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Home;
