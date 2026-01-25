import EditProfileModal from "@/components/EditProfileModal";
import PostsList from "@/components/PostsList";
import SignOutButton from "@/components/SignOutButton";
import UserList from "@/components/UserList";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePosts } from "@/hooks/usePosts";
import { useProfile } from "@/hooks/useProfile";
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
  RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreens = () => {
  const { currentUser, refetch: refetchMe } = useCurrentUser();
  const insets = useSafeAreaInsets();
  const api = useApiClient();

  const {
    posts: userPosts,
    refetch: refetchPosts,
  } = usePosts(currentUser?.username);

  const {
    isEditModalVisible,
    openEditModal,
    closeEditModal,
    formData,
    saveProfile,
    updateFormField,
    refetch: refetchProfile,
  } = useProfile();

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

  const fetchConnections = async (type: "Followers" | "Following") => {
    if (!currentUser?._id) return;
    setConnectionModal({ ...connectionModal, visible: true, type, loading: true });
    try {
      const res = type === "Followers"
        ? await followApi.getFollowers(api, currentUser._id)
        : await followApi.getFollowing(api, currentUser._id);

      setConnectionModal(prev => ({
        ...prev,
        users: type === "Followers" ? res.data.followers : res.data.following,
        loading: false
      }));
    } catch (error) {
      console.error("Fetch connections error:", error);
      setConnectionModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleFollowToggle = async (userId: string) => {
    try {
      await userApi.followUser(api, userId);
      refetchMe();
      // Optionally refresh the current list too
      const res = connectionModal.type === "Followers"
        ? await followApi.getFollowers(api, currentUser!._id)
        : await followApi.getFollowing(api, currentUser!._id);

      setConnectionModal(prev => ({
        ...prev,
        users: connectionModal.type === "Followers" ? res.data.followers : res.data.following
      }));
    } catch (error) {
      console.error("Follow toggle error:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {currentUser.firstName} {currentUser.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">{userPosts.length} Posts</Text>
        </View>
        <SignOutButton />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              currentUser.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: currentUser.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <TouchableOpacity
              className="border border-gray-300 px-6 py-2 rounded-full"
              onPress={openEditModal}
            >
              <Text className="font-semibold text-gray-900">Edit profile</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Feather name="check-circle" size={20} color="#1DA1F2" />
            </View>
            <Text className="text-gray-500 mb-2">@{currentUser.username}</Text>
            <Text className="text-gray-900 mb-3">{currentUser.bio}</Text>

            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">{currentUser.location}</Text>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="calendar" size={16} color="#657786" />
              <Text className="text-gray-500 ml-2">
                Joined {format(new Date(currentUser.createdAt), "MMMM yyyy")}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity className="mr-6" onPress={() => fetchConnections("Following")}>
                <Text className="text-gray-900">
                  <Text className="font-bold">{currentUser.following?.length || 0}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => fetchConnections("Followers")}>
                <Text className="text-gray-900">
                  <Text className="font-bold">{currentUser.followers?.length || 0}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={currentUser?.username} />
      </ScrollView>

      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={closeEditModal}
        formData={formData}
        saveProfile={saveProfile}
        updateFormField={updateFormField}
      />

      <Modal
        visible={connectionModal.visible}
        animationType="slide"
        onRequestClose={() => setConnectionModal(prev => ({ ...prev, visible: false }))}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <TouchableOpacity onPress={() => setConnectionModal(prev => ({ ...prev, visible: false }))}>
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-bold ml-4">{connectionModal.type}</Text>
          </View>
          <UserList
            users={connectionModal.users}
            loading={connectionModal.loading}
            followingIds={currentUser.following}
            onFollowToggle={handleFollowToggle}
            emptyMessage={`No ${connectionModal.type.toLowerCase()} yet.`}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreens;