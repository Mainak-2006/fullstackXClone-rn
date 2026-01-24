import React, { useRef } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { formatDate } from "../../utils/formatters";

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    createdAt: string;
}

interface MessageListProps {
    messages: Message[];
    currentUserId?: string;
    otherUser: {
        firstName: string;
        profilePicture?: string;
    };
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    otherUser,
}) => {
    const scrollViewRef = useRef<ScrollView>(null);

    return (
        <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4"
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
        >
            <View className="py-6">
                <View className="items-center mb-6">
                    <Image
                        source={{
                            uri:
                                otherUser.profilePicture ||
                                "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
                        }}
                        className="size-16 rounded-full mb-2"
                    />
                    <Text className="font-bold text-gray-900 text-lg">
                        {otherUser.firstName}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                        This is the beginning of your conversation with {otherUser.firstName}
                    </Text>
                </View>

                {messages.map((message) => {
                    const isMine = message.senderId === currentUserId;
                    return (
                        <View
                            key={message._id}
                            className={`flex-row mb-4 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                            {!isMine && (
                                <Image
                                    source={{
                                        uri:
                                            otherUser.profilePicture ||
                                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
                                    }}
                                    className="size-8 rounded-full mr-2 self-end"
                                />
                            )}
                            <View className={`max-w-[75%] ${isMine ? "items-end" : "items-start"}`}>
                                <View
                                    className={`px-4 py-2.5 rounded-2xl ${isMine
                                            ? "bg-[#1DA1F2] rounded-tr-none"
                                            : "bg-gray-100 rounded-tl-none"
                                        }`}
                                >
                                    <Text
                                        className={`text-[15px] leading-5 ${isMine ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {message.text}
                                    </Text>
                                </View>
                                <Text className="text-[10px] text-gray-400 mt-1">
                                    {formatDate(message.createdAt)}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default MessageList;
