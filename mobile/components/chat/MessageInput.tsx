import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface MessageInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSend: () => void;
    disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    value,
    onChangeText,
    onSend,
    disabled,
}) => {
    return (
        <View className="flex-row items-end px-4 py-3 border-t border-gray-100 bg-white">
            <TouchableOpacity className="mb-2 mr-3">
                <Feather name="image" size={22} color="#1DA1F2" />
            </TouchableOpacity>

            <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 min-h-[40px] max-h-[100px] justify-center mr-3">
                <TextInput
                    className="text-[15px] p-0 text-gray-900"
                    placeholder="Start a message..."
                    placeholderTextColor="#657786"
                    value={value}
                    onChangeText={onChangeText}
                    multiline
                />
            </View>

            <TouchableOpacity
                onPress={onSend}
                disabled={disabled}
                className={`size-9 rounded-full items-center justify-center mb-0.5 ${disabled ? "opacity-50" : "bg-[#1DA1F2]"
                    }`}
            >
                <Feather name="send" size={18} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default MessageInput;
