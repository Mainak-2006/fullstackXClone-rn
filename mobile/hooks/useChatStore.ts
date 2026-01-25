import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { AxiosInstance } from "axios";
import { Alert } from "react-native";
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
        const { selectedUser } = get();
        if (!selectedUser) return;

        try {
            console.log("Sending message to:", selectedUser._id, messageData);
            const res = await messageApi.sendMessage(api, selectedUser._id, messageData);
            set({ messages: [...get().messages, res.data] });
        } catch (error: any) {
            console.error("Error sending message:", error?.response?.data || error.message);
            const errorMsg = error?.response?.data?.error || "Failed to send message";
            Alert.alert("Message Not Sent", errorMsg);
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user }),

    connectSocket: (userId) => {
        const { socket } = get();
        if (socket?.connected) return;

        // Strip /api and any trailing slashes for clean socket connection
        const socketUrl = BASE_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");
        console.log("Connecting to socket at:", socketUrl, "with userId:", userId);

        const newSocket = io(socketUrl, {
            query: {
                userId: userId,
            },
            // Start with polling and upgrade to websocket for better compatibility
            transports: ["polling", "websocket"],
            forceNew: true,
            secure: socketUrl.startsWith("https"),
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
            console.log("Socket connected ✅", newSocket.id);
            set({ socket: newSocket, currentUserId: userId });
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error ❌:", error.message);

            // If websocket fails, try to fallback to polling explicitly if not already tried
            if (newSocket.io.opts.transports?.[0] === "websocket") {
                console.log("Retrying with polling...");
                newSocket.io.opts.transports = ["polling", "websocket"];
                newSocket.connect();
            }
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            console.log("Online users updated:", userIds);
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) socket.disconnect();
    },

    subscribeToMessages: () => {
        const { selectedUser, socket } = get();
        if (!socket) {
            console.warn("Cannot subscribe: socket is null");
            return;
        }
        if (!selectedUser) {
            console.warn("Cannot subscribe: selectedUser is null");
            return;
        }

        // Remove existing listener to avoid duplicates
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const { currentUserId, messages } = get();
            console.log("Received new message:", newMessage);

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
