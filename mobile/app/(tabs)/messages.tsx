import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,

} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "../../hooks/useChatStore";
import { useApiClient } from "../../utils/api";
import { formatDate } from "../../utils/formatters";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import ConversationView from "../../components/chat/ConversationView";

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const api = useApiClient();
  const { currentUser } = useCurrentUser();
  const {
    users,
    messages,
    selectedUser,

    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    onlineUsers,
  } = useChatStore();

  const [searchText, setSearchText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getUsers(api);
  }, [getUsers, api]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(api, selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, api, subscribeToMessages, unsubscribeFromMessages]);

  const openConversation = (user: any) => {
    setSelectedUser(user);
    setIsChatOpen(true);
  };

  const closeChatModal = () => {
    setIsChatOpen(false);
    setSelectedUser(null);
    setNewMessage("");
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      await sendMessage(api, { text: newMessage });
      setNewMessage("");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.username}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search for people"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* CONVERSATIONS LIST (Users) */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {filteredUsers.length === 0 ? (
          <View className="flex-1 items-center justify-center p-10">
            <Text className="text-gray-500 text-center">No users found</Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <TouchableOpacity
              key={user._id}
              className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
              onPress={() => openConversation(user)}
            >
              <View>
                <Image
                  source={{ uri: user.profilePicture || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png" }}
                  className="size-12 rounded-full mr-3"
                />
                {onlineUsers.includes(user._id) && (
                  <View className="absolute bottom-0 right-3 size-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-1">
                    <Text className="font-semibold text-gray-900">
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text className="text-gray-500 text-sm ml-1">@{user.username}</Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  Tap to message
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
        {selectedUser && (
          <ConversationView
            user={selectedUser}
            messages={messages}
            currentUserId={currentUser?._id}

            isOnline={onlineUsers.includes(selectedUser._id)}
            onBack={closeChatModal}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MessagesScreen;