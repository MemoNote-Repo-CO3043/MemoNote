import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

interface NoteItemProps {
  second: number;
  bookmark: string;
  text: string;
  id: number;
  onTimePress: (second: number) => void;
  openEditNote: (text: string) => void;
}
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const NoteItem: React.FC<NoteItemProps> = ({
  second,
  bookmark,
  text,
  id,
  onTimePress,
  openEditNote,
}) => {
  return (
    <View className="p-2">
      <View className="border-b pb-2 border-zinc-300">
        <View className="flex-row">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg w-24 py-2 border"
            style={{ borderColor: "#0B963E" }}
            onPress={() => onTimePress(second)}
          >
            <Text className="text-black">{formatTime(second)}</Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-center rounded-t-lg p-2">
            <FontAwesome name="bookmark" size={20} color={"#0B963E"} />
            <Text className="text-black font-semibold pl-4 pr-16">
              {bookmark}
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row items-center">
          <Text className="border w-5/6 p-2 rounded-lg flex-grow">{text}</Text>
          <TouchableOpacity className="ml-2" onPress={() => openEditNote(text)}>
            <AntDesign name="edit" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2">
            <AntDesign name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default NoteItem;
