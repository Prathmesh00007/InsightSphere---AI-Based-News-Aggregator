import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";
import { authApi } from '../services/api';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningIn: false,
  userRole: null,
  user: null,
  token: localStorage.getItem('token'),

  isLoading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const { user, token } = await authApi.login(email, password);
      set({ user, token });
      localStorage.setItem('token', token);
      toast.success('Successfully logged in');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to login');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true });
      const { user, token } = await authApi.register(userData);
      set({ user, token });
      localStorage.setItem('token', token);
      toast.success('Successfully registered');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to register');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.success('Successfully logged out');
  },

  updateProfile: async (userData) => {
    try {
      set({ isLoading: true });
      const updatedUser = await authApi.updateProfile(userData);
      set({ user: updatedUser });
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      set({ isLoading: true });
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  isAuthenticated: () => {
    return !!token;
  },

  isViewingNews : false,
  viewNews : async (data) => {
    const {authUser} = get();

    try {
        console.log("Data submitted for viewing news: ", data);
        const res = await axiosInstance.post(`/auth/view-news/${authUser._id}`, data);
        if(res.data.success){
            toast.success("News added to your history!");
            window.open(data.newsUrl, '_blank');
        }
        set({isViewingNews : true});
    } catch (error) {
        console.log("Error in viewing news: ", error);

        if(error.response.data){
            console.log(error.response.data);
            toast.error(error.response.data.message || "Login to view the news!");
        }
    }
    set({isViewingNews : false});
  },

  isSavingPost : false,
  savePost : async (data) => {
    const {authUser} = get();
    try {
      set({isSavingPost : true})
      console.log("Data submitted for saving news: ", data);
      const res = await axiosInstance.post(`/auth/save-post/${authUser._id}`, data);
      if(res.data.success){
        toast.success(res.data.message || "Post saved successfully, visit profile to view.");
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log("Error in saving post: ", error);
      if(error.response){
        toast.error(error.response.data.message || "Failed to save the post, try again!");
      }
    } finally{
      set({isSavingPost: false});
    }
  },

  isFetchingNews : false,
  categorisedArticles : [],
  fetchBasedOnCategory : async () => {
    try {
      set({isFetchingNews : true});
      console.log("fetching the news for categories")
      const res = await axiosInstance.get('/auth/world-news');
      if(res.data.success){
        toast.success(res.data.message || "Articles based on your preferences fetched successfully!")
        set({categorisedArticles : res.data.articles});
      }
    } catch (error) {
      console.log("Failed to fetch news: ", error)
      if(error.response){
        toast.error(error.response.data.message || "Failed to fetch news, try again!");
      }
    } finally{
      set({isFetchingNews : false});
    }
  }
}));

