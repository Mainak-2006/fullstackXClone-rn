import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { AxiosInstance } from "axios";
import { messageApi } from "../utils/api";

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: string;
}

interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

interface ChatState {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    onlineUsers: string[];
    socket: Socket | null;

    getUsers: (api: AxiosInstance) => Promise<void>;
    getMessages: (api: AxiosInstance, userId: string) => Promise<void>;
    sendMessage: (api: AxiosInstance, messageData: { text: string; image?: string }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    connectSocket: (userId: string) => void;
    disconnectSocket: () => void;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL|| "http://localhost:5001";

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],
    socket: null,

    getUsers: async (api) => {
        set({ isUsersLoading: true });
        try {
            const res = await messageApi.getUsers(api);
            set({ users: res.data });
        } catch (error: any) {
            console.error("Error fetching users:", error.response?.data?.message || error.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (api, userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await messageApi.getMessages(api, userId);
            set({ messages: res.data });
        } catch (error: any) {
            console.error("Error fetching messages:", error.response?.data?.message || error.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (api, messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        try {
            const res = await messageApi.sendMessage(api, selectedUser._id, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            console.error("Error sending message:", error.response?.data?.message || error.message);
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user }),

    connectSocket: (userId) => {
        const { socket } = get();
        if (socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query: {
                userId: userId,
            },
        });
        newSocket.connect();

        set({ socket: newSocket });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) socket.disconnect();
    },

    subscribeToMessages: () => {
        const { selectedUser, socket } = get();
        if (!socket || !selectedUser) return;

        socket.on("newMessage", (newMessage) => {
            // only add message if it's from the currently selected user
            if (newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const { socket } = get();
        if (socket) socket.off("newMessage");
    },
}));
