import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, TextInput, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApiClient, userApi } from "../../utils/api";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const TRENDING_TOPICS = [
  { topic: "#ReactNative", tweets: "125K" },
  { topic: "#TypeScript", tweets: "89K" },
  { topic: "#WebDevelopment", tweets: "234K" },
  { topic: "#AI", tweets: "567K" },
  { topic: "#TechNews", tweets: "98K" },
];

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const api = useApiClient();
  const { currentUser, refetch: refetchMe } = useCurrentUser();

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const res = await userApi.searchUsers(api, query);
        setUsers(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [query, api]);

  const handleFollow = async (userId: string) => {
    try {
      await userApi.followUser(api, userId);
      // Refresh user list to update follow status locally
      // In a real app we'd use React Query or update state manually
      const res = await userApi.searchUsers(api, query);
      setUsers(res.data);
      refetchMe();
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search X"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {loading && (
          <View className="p-4 items-center">
            <ActivityIndicator color="#1DA1F2" />
          </View>
        )}

        {!loading && query.trim() !== "" && users.length === 0 && (
          <View className="p-10 items-center">
            <Text className="text-gray-500">No users found for "{query}"</Text>
          </View>
        )}

        {users.length > 0 && (
          <View className="border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900 p-4">People</Text>
            {users.map((user) => {
              const isFollowing = currentUser?.following?.includes(user._id);
              return (
                <View key={user._id} className="flex-row items-center p-4 border-b border-gray-50">
                  <Image
                    source={{ uri: user.profilePicture || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" }}
                    className="size-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text className="text-gray-500">@{user.username}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleFollow(user._id)}
                    className={`px-4 py-1.5 rounded-full border ${isFollowing ? "bg-white border-gray-300" : "bg-black border-black"
                      }`}
                  >
                    <Text className={`font-bold ${isFollowing ? "text-gray-900" : "text-white"}`}>
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <View className="p-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">Trending for you</Text>
          {TRENDING_TOPICS.map((item, index) => (
            <TouchableOpacity key={index} className="py-3 border-b border-gray-100">
              <Text className="text-gray-500 text-sm">Trending in Technology</Text>
              <Text className="font-bold text-gray-900 text-lg">{item.topic}</Text>
              <Text className="text-gray-500 text-sm">{item.tweets} Tweets</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;