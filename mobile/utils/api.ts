import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'mobile/1.0',
      'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
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
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
};
export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
};

export const followApi = {
  followUser: (api: AxiosInstance, userId: string) => api.post(`/users/follow/${userId}`),
  unfollowUser: (api: AxiosInstance, userId: string) => api.post(`/users/unfollow/${userId}`),
  getFollowers: (api: AxiosInstance, userId: string) => api.get(`/users/${userId}/followers`),
  getFollowing: (api: AxiosInstance, userId: string) => api.get(`/users/${userId}/following`),
};

export const messageApi = {
  getUsers: (api: AxiosInstance) => api.get("/messages/users"),
  getMessages: (api: AxiosInstance, userId: string) => api.get(`/messages/${userId}`),
  sendMessage: (api: AxiosInstance, userId: string, data: { text: string; image?: string }) =>
    api.post(`/messages/send/${userId}`, data),
};

export const notificationApi = {
  getNotifications: (api: AxiosInstance) => api.get("/notifications"),
  deleteNotification: (api: AxiosInstance, notificationId: string) =>
    api.delete(`/notifications/${notificationId}`),
};
