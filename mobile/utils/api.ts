import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  // Normalize the base URL - remove trailing slash to avoid redirect issues
  const normalizedBaseURL = API_BASE_URL?.replace(/\/$/, '');

  const api = axios.create({
    baseURL: normalizedBaseURL,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'mobile/1.0',
      'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
    maxRedirects: 5, // Handle redirects properly (default is 5)
    validateStatus: (status) => {
      // Accept all status codes between 200-299
      // Reject 300-level codes which indicate redirects that weren't followed
      return status >= 200 && status < 300;
    },
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Enhanced error logging for debugging
      if (error.response) {
        // Server responded with error status
        console.error('API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          data: error.response.data,
        });
      } else if (error.request) {
        // Request was made but no response received
        console.error('API No Response:', {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          message: error.message,
        });
      } else {
        // Error in setting up the request
        console.error('API Request Setup Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", {
    bio: encodeURIComponent(data.bio),
    location: encodeURIComponent(data.location),
    profilePicture: data.profilePicture ? encodeURIComponent(data.profilePicture) : "",
    bannerImage: data.bannerImage ? encodeURIComponent(data.bannerImage) : ""
  }),
  searchUsers: (api: AxiosInstance, query: string) => api.get(`/users/search-users?query=${encodeURIComponent(query)}`),
  followUser: (api: AxiosInstance, userId: string) => api.post(`/users/follow/${encodeURIComponent(userId)}`),
  saveSearchHistory: (api: AxiosInstance, query: string, searchedUserId?: string) =>
    api.post("/users/search-history", { query: encodeURIComponent(query), searchedUserId: searchedUserId ? encodeURIComponent(searchedUserId) : "" }),
  getSearchHistory: (api: AxiosInstance) => api.get("/users/search-history"),
  clearSearchHistory: (api: AxiosInstance, id?: string) =>
    api.delete(`/users/search-history${id ? `/${encodeURIComponent(id)}` : ""}`),
};
export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts", { content: encodeURIComponent(data.content), image: data.image ? encodeURIComponent(data.image) : "" }),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${encodeURIComponent(username)}`),
  likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${encodeURIComponent(postId)}/like`),
  deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${encodeURIComponent(postId)}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${encodeURIComponent(postId)}`, { content: encodeURIComponent(content) }),
};

export const followApi = {
  followUser: (api: AxiosInstance, userId: string) => api.post(`/users/follow/${encodeURIComponent(userId)}`),
  unfollowUser: (api: AxiosInstance, userId: string) => api.post(`/users/unfollow/${encodeURIComponent(userId)}`),
  getFollowers: (api: AxiosInstance, userId: string) => api.get(`/users/${encodeURIComponent(userId)}/followers`),
  getFollowing: (api: AxiosInstance, userId: string) => api.get(`/users/${encodeURIComponent(userId)}/following`),
};

export const notificationApi = {
  getNotifications: (api: AxiosInstance) => api.get("/notifications"),
  markNotificationAsRead: (api: AxiosInstance, notificationId: string) =>
    api.post(`/notifications/mark-read/${encodeURIComponent(notificationId)}`),
};
