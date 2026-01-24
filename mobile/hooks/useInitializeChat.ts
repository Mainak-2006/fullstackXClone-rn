import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useChatStore } from "./useChatStore";
import { useCurrentUser } from "./useCurrentUser";

export const useInitializeChat = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const { currentUser } = useCurrentUser();
    const { connectSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        if (isLoaded && isSignedIn && currentUser?._id) {
            connectSocket(currentUser._id);
        } else if (isLoaded && !isSignedIn) {
            disconnectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [isLoaded, isSignedIn, currentUser, connectSocket, disconnectSocket]);
};
