import { create } from 'zustand';
import { newsApi, analysisApi } from '../services/api';
import { toast } from 'react-toastify';

const useNewsStore = create((set) => ({
  articles: [],
  sources: [],
  categories: [],
  isLoading: false,
  filters: {
    category: null,
    source: null,
    days: 7,
  },

  // News fetching
  fetchLatestNews: async (params = {}) => {
    try {
      set({ isLoading: true });
      const articles = await newsApi.getLatestNews(params);
      set({ articles });
    } catch (error) {
      toast.error('Failed to fetch latest news');
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchNews: async (query, params = {}) => {
    try {
      set({ isLoading: true });
      const articles = await newsApi.searchNews(query, params);
      set({ articles });
    } catch (error) {
      toast.error('Failed to search news');
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Sources and categories
  fetchSources: async () => {
    try {
      const sources = await newsApi.getSources();
      set({ sources });
    } catch (error) {
      toast.error('Failed to fetch news sources');
      console.error(error);
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await newsApi.getCategories();
      set({ categories });
    } catch (error) {
      toast.error('Failed to fetch news categories');
      console.error(error);
    }
  },

  // Analysis data
  sentimentTrends: null,
  topEntities: null,
  categoryDistribution: null,
  sourceAnalysis: null,

  fetchSentimentTrends: async (params = {}) => {
    try {
      set({ isLoading: true });
      const trends = await analysisApi.getSentimentTrends(params);
      set({ sentimentTrends: trends });
    } catch (error) {
      toast.error('Failed to fetch sentiment trends');
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTopEntities: async (params = {}) => {
    try {
      set({ isLoading: true });
      const entities = await analysisApi.getTopEntities(params);
      set({ topEntities: entities });
    } catch (error) {
      toast.error('Failed to fetch top entities');
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategoryDistribution: async (params = {}) => {
    try {
      set({ isLoading: true });
      const distribution = await analysisApi.getCategoryDistribution(params);
      set({ categoryDistribution: distribution });
    } catch (error) {
      toast.error('Failed to fetch category distribution');
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSourceAnalysis: async (params = {}) => {
    try {
      set({ isLoading: true });
      const analysis = await analysisApi.getSourceAnalysis(params);
      set({ sourceAnalysis: analysis });
    } catch (error) {
      toast.error('Failed to fetch source analysis');
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Filter management
  setFilter: (filter, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filter]: value,
      },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        category: null,
        source: null,
        days: 7,
      },
    });
  },
}));

export default useNewsStore; 