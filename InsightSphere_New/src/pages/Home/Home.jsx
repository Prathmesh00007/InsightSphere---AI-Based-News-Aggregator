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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading latest news...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="header mb-10"
      >
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 md:text-6xl lg:text-7xl mb-4">
          InsightSphere
        </h1>
        <p className="text-lg italic text-center text-gray-700 md:text-xl lg:text-2xl mb-6">
          Discover What Matters, Tailored Just for You
        </p>
      </motion.div>

      {articles.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-6 overflow-hidden rounded-lg"
        >
          {articles[0].urlToImage && (
            <img 
              src={articles[0].urlToImage} 
              className="w-full h-72 object-cover transition-transform duration-300 hover:scale-105" 
              alt="News" 
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold text-center p-4">
              {articles[0].title}
            </h2>
          </div>
        </motion.div>
      )}

      <h1 className="text-2xl font-bold mb-4">Latest News</h1>
      <motion.ul 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {article.urlToImage && (
              <img 
                src={article.urlToImage} 
                alt="News" 
                className="rounded-t-lg w-full h-48 object-cover" 
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-700 mb-4">
                {article.description?.slice(0, 75)}...
              </p>
              <button
                onClick={() => handleViewNews(article)}
                className="block bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition w-full"
              >
                Read More
              </button>
              <button
                onClick={() => handleSaveNews(article)}
                className="block bg-orange-500 text-black text-center py-2 rounded hover:bg-orange-800 hover:text-white mt-2 transition w-full"
              >
                Save Post
              </button>
            </div>
          </motion.div>
        ))}
      </motion.ul>
    </div>
  );
}

export default Home;
