import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

function Latest() {
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
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Latest News
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                className="w-full h-48 object-cover" 
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-700 mb-4">
                {article.description?.slice(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                {new Date(article.published_at).toLocaleDateString()}

                </span>
                <span className="text-sm text-gray-500">
                  {article.source?.name}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleViewNews(article)}
                  className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition"
                >
                  Read More
                </button>
                <button
                  onClick={() => handleSaveNews(article)}
                  className="block w-full bg-orange-500 text-black text-center py-2 rounded hover:bg-orange-800 hover:text-white transition"
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

export default Latest;
