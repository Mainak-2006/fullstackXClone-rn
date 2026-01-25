import PostsList from "@/components/PostsList";
import UserList from "@/components/UserList";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useApiClient, followApi, userApi } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const UserProfileScreen = () => {
    const { username } = useLocalSearchParams<{ username: string }>();
    const { currentUser, refetch: refetchMe } = useCurrentUser();
    const insets = useSafeAreaInsets();
    const api = useApiClient();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const { posts: userPosts, refetch: refetchPosts } = usePosts(username);

    const [connectionModal, setConnectionModal] = useState<{
        visible: boolean;
        type: "Followers" | "Following";
        users: any[];
        loading: boolean;
    }>({
        visible: false,
        type: "Followers",
        users: [],
        loading: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (!username) return;
            setLoading(true);
            try {
                const res = await api.get(`/users/profile/${username}`);
                setUser(res.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    const fetchConnections = async (type: "Followers" | "Following") => {
        if (!user?._id) return;
        setConnectionModal({ ...connectionModal, visible: true, type, loading: true });
        try {
            const res =
                type === "Followers"
                    ? await followApi.getFollowers(api, user._id)
                    : await followApi.getFollowing(api, user._id);

            setConnectionModal((prev) => ({
                ...prev,
                users: type === "Followers" ? res.data.followers : res.data.following,
                loading: false,
            }));
        } catch (error) {
            console.error("Fetch connections error:", error);
            setConnectionModal((prev) => ({ ...prev, loading: false }));
        }
    };

    const handleFollowToggle = async () => {
        if (!user?._id) return;
        try {
            await userApi.followUser(api, user._id);
            refetchMe();
            // Refresh user data
            const res = await api.get(`/users/profile/${username}`);
            setUser(res.data.user);
        } catch (error) {
            console.error("Follow toggle error:", error);
        }
    };

    const handleFollowInModal = async (userId: string) => {
        try {
            await userApi.followUser(api, userId);
            refetchMe();
            // Refresh connections list
            const res =
                connectionModal.type === "Followers"
                    ? await followApi.getFollowers(api, user!._id)
                    : await followApi.getFollowing(api, user!._id);

            setConnectionModal((prev) => ({
                ...prev,
                users: connectionModal.type === "Followers" ? res.data.followers : res.data.following,
            }));
        } catch (error) {
            console.error("Follow toggle error:", error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={["top"]}>
                <ActivityIndicator size="large" color="#1DA1F2" />
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900 ml-4">Profile</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">User not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isFollowing = currentUser?.following?.includes(user._id);
    const isMyProfile = currentUser?._id === user._id;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <View className="ml-4">
                    <Text className="text-xl font-bold text-gray-900">
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm">{userPosts.length} Posts</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
                showsVerticalScrollIndicator={false}
            >
                <Image
                    source={{
                        uri:
                            user.bannerImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
                    }}
                    className="w-full h-48"
                    resizeMode="cover"
                />

                <View className="px-4 pb-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-end -mt-16 mb-4">
                        <Image source={{ uri: user.profilePicture }} className="w-32 h-32 rounded-full border-4 border-white" />
                        {!isMyProfile && (
                            <TouchableOpacity
                                className={`px-6 py-2 rounded-full border ${isFollowing ? "border-gray-300 bg-white" : "bg-black border-black"
                                    }`}
                                onPress={handleFollowToggle}
                            >
                                <Text className={`font-semibold ${isFollowing ? "text-gray-900" : "text-white"}`}>
                                    {isFollowing ? "Following" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className="mb-4">
                        <View className="flex-row items-center mb-1">
                            <Text className="text-xl font-bold text-gray-900 mr-1">
                                {user.firstName} {user.lastName}
                            </Text>
                            <Feather name="check-circle" size={20} color="#1DA1F2" />
                        </View>
                        <Text className="text-gray-500 mb-2">@{user.username}</Text>
                        {user.bio && <Text className="text-gray-900 mb-3">{user.bio}</Text>}

                        {user.location && (
                            <View className="flex-row items-center mb-2">
                                <Feather name="map-pin" size={16} color="#657786" />
                                <Text className="text-gray-500 ml-2">{user.location}</Text>
                            </View>
                        )}

                        <View className="flex-row items-center mb-3">
                            <Feather name="calendar" size={16} color="#657786" />
                            <Text className="text-gray-500 ml-2">Joined {format(new Date(user.createdAt), "MMMM yyyy")}</Text>
                        </View>

                        <View className="flex-row">
                            <TouchableOpacity className="mr-6" onPress={() => fetchConnections("Following")}>
                                <Text className="text-gray-900">
                                    <Text className="font-bold">{user.following?.length || 0}</Text>
                                    <Text className="text-gray-500"> Following</Text>
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => fetchConnections("Followers")}>
                                <Text className="text-gray-900">
                                    <Text className="font-bold">{user.followers?.length || 0}</Text>
                                    <Text className="text-gray-500"> Followers</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <PostsList username={username} />
            </ScrollView>

            <Modal
                visible={connectionModal.visible}
                animationType="slide"
                onRequestClose={() => setConnectionModal((prev) => ({ ...prev, visible: false }))}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="flex-row items-center p-4 border-b border-gray-100">
                        <TouchableOpacity onPress={() => setConnectionModal((prev) => ({ ...prev, visible: false }))}>
                            <Feather name="arrow-left" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold ml-4">{connectionModal.type}</Text>
                    </View>
                    <UserList
                        users={connectionModal.users}
                        loading={connectionModal.loading}
                        followingIds={currentUser?.following || []}
                        onFollowToggle={handleFollowInModal}
                        emptyMessage={`No ${connectionModal.type.toLowerCase()} yet.`}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default UserProfileScreen;
