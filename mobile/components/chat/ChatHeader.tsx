import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ChatHeaderProps {
    user: {
        _id: string;
        username: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    onBack: () => void;
    isOnline: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ user, onBack, isOnline }) => {
    return (
        <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white">
            <TouchableOpacity onPress={onBack} className="mr-3">
                <Feather name="arrow-left" size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <Image
                source={{
                    uri:
                        user.profilePicture ||
                        "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
                }}
                className="size-10 rounded-full mr-3"
            />
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Text className="font-semibold text-gray-900 mr-1 text-base">
                        {user.firstName} {user.lastName}
                    </Text>
                    {isOnline && (
                        <View className="size-2 bg-green-500 rounded-full" />
                    )}
                </View>
                <Text className="text-gray-500 text-xs">@{user.username}</Text>
            </View>
            <TouchableOpacity>
                <Feather name="info" size={20} color="#1DA1F2" />
            </TouchableOpacity>
        </View>
    );
};

export default ChatHeader;
