import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";

interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
}

interface UserListProps {
    users: User[];
    loading?: boolean;
    onFollowToggle?: (userId: string) => void;
    followingIds?: string[];
    emptyMessage?: string;
}

const UserList: React.FC<UserListProps> = ({
    users,
    loading,
    onFollowToggle,
    followingIds = [],
    emptyMessage = "No users found",
}) => {
    if (loading) {
        return (
            <View className="p-10 items-center">
                <ActivityIndicator color="#1DA1F2" />
            </View>
        );
    }

    if (users.length === 0) {
        return (
            <View className="p-10 items-center">
                <Text className="text-gray-500">{emptyMessage}</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            {users.map((user) => {
                const isFollowing = followingIds.includes(user._id);
                return (
                    <View key={user._id} className="flex-row items-center p-4 border-b border-gray-50">
                        <Image
                            source={{
                                uri:
                                    user.profilePicture ||
                                    "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
                            }}
                            className="size-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <Text className="font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </Text>
                            <Text className="text-gray-500">@{user.username}</Text>
                        </View>
                        {onFollowToggle && (
                            <TouchableOpacity
                                onPress={() => onFollowToggle(user._id)}
                                className={`px-4 py-1.5 rounded-full border ${isFollowing ? "bg-white border-gray-300" : "bg-black border-black"
                                    }`}
                            >
                                <Text className={`font-bold ${isFollowing ? "text-gray-900" : "text-white"}`}>
                                    {isFollowing ? "Following" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default UserList;
