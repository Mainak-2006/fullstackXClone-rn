import PostComposer from "@/components/PostComposer";
import SignOutButton from "@/components/SignOutButton";
import { useUserSync } from "@/hooks/useUserSync";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {


  useUserSync();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
      <FontAwesome6 name="x-twitter" size={24} color="black" />
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <SignOutButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PostComposer />
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;