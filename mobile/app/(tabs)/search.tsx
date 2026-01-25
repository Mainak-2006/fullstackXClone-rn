import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, TextInput, ScrollView, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApiClient, userApi } from "../../utils/api";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import { useRouter } from "expo-router";

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
  const { history, saveHistory, clearHistory } = useSearchHistory();
  const router = useRouter();

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
      const res = await userApi.searchUsers(api, query);
      setUsers(res.data);
      refetchMe();
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const handleUserClick = (user: any) => {
    // Save to search history
    saveHistory(query, user._id);
    // Navigate to user profile
    router.push(`/profile?username=${user.username}`);
  };

  const handleHistoryClick = (historyItem: any) => {
    if (historyItem.searchedUserId) {
      // Navigate directly to the user's profile
      router.push(`/profile?username=${historyItem.searchedUserId.username}`);
    } else {
      // Fill the search bar with the query
      setQuery(historyItem.query);
    }
  };

  const handleClearHistory = (id?: string) => {
    clearHistory(id);
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
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x-circle" size={20} color="#657786" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1">
        {loading && (
          <View className="p-4 items-center">
            <ActivityIndicator color="#1DA1F2" />
          </View>
        )}

        {/* Search History - Show when no query */}
        {!loading && query.trim() === "" && history.length > 0 && (
          <View className="border-b border-gray-100">
            <View className="flex-row justify-between items-center p-4">
              <Text className="text-xl font-bold text-gray-900">Recent Searches</Text>
              <TouchableOpacity onPress={() => handleClearHistory()}>
                <Text className="text-blue-500 font-semibold">Clear all</Text>
              </TouchableOpacity>
            </View>
            {history.map((item) => (
              <View key={item._id} className="flex-row items-center px-4 py-3 border-b border-gray-50">
                <TouchableOpacity
                  className="flex-1 flex-row items-center"
                  onPress={() => handleHistoryClick(item)}
                >
                  <Feather name="clock" size={20} color="#657786" className="mr-3" />
                  {item.searchedUserId ? (
                    <View className="flex-1 flex-row items-center ml-3">
                      <Image
                        source={{
                          uri:
                            item.searchedUserId.profilePicture ||
                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
                        }}
                        className="size-10 rounded-full mr-3"
                      />
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900">
                          {item.searchedUserId.firstName} {item.searchedUserId.lastName}
                        </Text>
                        <Text className="text-gray-500 text-sm">@{item.searchedUserId.username}</Text>
                      </View>
                    </View>
                  ) : (
                    <Text className="flex-1 text-gray-900 ml-3">{item.query}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleClearHistory(item._id)}>
                  <Feather name="x" size={18} color="#657786" />
                </TouchableOpacity>
              </View>
            ))}
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
                <TouchableOpacity
                  key={user._id}
                  onPress={() => handleUserClick(user)}
                  className="flex-row items-center p-4 border-b border-gray-50"
                >
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
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleFollow(user._id);
                    }}
                    className={`px-4 py-1.5 rounded-full border ${isFollowing ? "bg-white border-gray-300" : "bg-black border-black"
                      }`}
                  >
                    <Text className={`font-bold ${isFollowing ? "text-gray-900" : "text-white"}`}>
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Show trending topics when no search query */}
        {query.trim() === "" && (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;