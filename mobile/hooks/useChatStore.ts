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

    onlineUsers: string[];
    socket: Socket | null;
    currentUserId: string | null;

    getUsers: (api: AxiosInstance) => Promise<void>;
    getMessages: (api: AxiosInstance, userId: string) => Promise<void>;
    sendMessage: (api: AxiosInstance, messageData: { text: string; image?: string }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    connectSocket: (userId: string) => void;
    disconnectSocket: () => void;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001";

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,

    onlineUsers: [],
    socket: null,
    currentUserId: null,

    getUsers: async (api) => {
        try {
            const res = await messageApi.getUsers(api);
            set({ users: res.data });
        } catch (error: any) {
            // Error handled by store state
        }
    },

    getMessages: async (api, userId) => {
        try {
            const res = await messageApi.getMessages(api, userId);
            set({ messages: res.data });
        } catch (error: any) {
            // Error handled by store state
        }
    },

    sendMessage: async (api, messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        try {
            const res = await messageApi.sendMessage(api, selectedUser._id, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            // Error handled by store state
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user }),

    connectSocket: (userId) => {
        const { socket } = get();
        if (socket?.connected) return;

        // Strip /api from the URL for socket connection if it exists
        const socketUrl = BASE_URL.endsWith("/api") ? BASE_URL.replace(/\/api$/, "") : BASE_URL;

        const newSocket = io(socketUrl, {
            query: {
                userId: userId,
            },
        });
        newSocket.connect();

        set({ socket: newSocket, currentUserId: userId });

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
            const { currentUserId } = get();
            // only add message if it belongs to the currently selected conversation
            const isRelevant =
                (newMessage.senderId === selectedUser._id && newMessage.receiverId === currentUserId) ||
                (newMessage.senderId === currentUserId && newMessage.receiverId === selectedUser._id);

            if (!isRelevant) return;

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
