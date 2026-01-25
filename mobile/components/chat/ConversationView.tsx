import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface ConversationViewProps {
    user: any;
    messages: any[];
    currentUserId?: string;

    isOnline: boolean;
    onBack: () => void;
    newMessage: string;
    setNewMessage: (text: string) => void;
    onSendMessage: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
    user,
    messages,
    currentUserId,

    isOnline,
    onBack,
    newMessage,
    setNewMessage,
    onSendMessage,
}) => {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
            <ChatHeader user={user} onBack={onBack} isOnline={isOnline} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <MessageList
                    messages={messages}
                    currentUserId={currentUserId}
                    otherUser={user}
                />

                <MessageInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    onSend={onSendMessage}
                    disabled={!newMessage.trim()}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ConversationView;
