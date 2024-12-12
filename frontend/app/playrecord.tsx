import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from "react-native";
import { Link } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import NoteItem from "./components/NoteItem";
const noteList = [
  {
    second: 120,
    bookmark: "IMPORTANT",
    text: "This is the first chapter of the book",
    id: 1,
  },
  {
    second: 150,
    bookmark: "URGENT",
    text: "This is the second chapter of the book",
    id: 2,
  },
  {
    second: 180,
    bookmark: "RESEARCH",
    text: "This is the third chapter of the book",
    id: 3,
  },
  {
    second: 300,
    bookmark: "RESEARCH",
    text: "This is the third chapter of the book",
    id: 4,
  },
  {
    second: 360,
    bookmark: "RESEARCH",
    text: "This is the third chapter of the book",
    id: 5,
  },
];
const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function PlayRecord() {
  const [isEdit, setIsEdit] = useState(false);
  const [textEdit, setTextEdit] = useState("");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
    player.currentTime = 0;
  });
  const seekAt = (second: number) => {
    player.currentTime = second;
  };
  const openEditNote = (text: string) => {
    setIsEdit(!isEdit);
    setTextEdit(text);
  };

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownOptions = ["ALL", "URGENT", "IMPORTANT", "EXAM", "RESEARCH"];
  return (
    <View className="flex-1">
      <View
        className={`w-full h-1/3 ${
          isEdit ? "inset-0 bg-black opacity-50" : ""
        }`}
      >
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>
      <View
        className={`w-11/12 flex-row pb-3 pl-3 pt-1 ${
          isEdit ? "inset-0 bg-black opacity-50" : ""
        }`}
      >
        <View className="flex-1">
          <Text className="text-2xl font-bold pb-2">Giải tích</Text>
          <Text>12/12/2024 - 17:23</Text>
        </View>
        <Feather name="more-horizontal" size={24} color="black" />
      </View>
      <View
        className={`flex-row p-2 border-y border-zinc-300 justify-between items-center ${
          isEdit ? "inset-0 bg-black opacity-50" : ""
        }`}
      >
        <View>
          <TouchableOpacity
            style={{ backgroundColor: "#0B963E" }}
            className="flex-row items-center justify-center bg-blue-500 rounded-lg w-28 py-2"
          >
            <Entypo name="plus" size={22} color="white" />
            <Text className="ml-2 text-white font-semibold">NOTE</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-t-lg p-2"
            onPress={() => setDropdownVisible(!isDropdownVisible)}
            style={{
              backgroundColor: isDropdownVisible ? "white" : "#0B963E",
              borderColor: isDropdownVisible ? "#0B963E" : "transparent",
              borderWidth: isDropdownVisible ? 1 : 0,
            }}
          >
            <FontAwesome
              name="bookmark"
              size={20}
              style={{
                color: isDropdownVisible ? "#0B963E" : "white",
              }}
            />
            <Text
              className="text-white font-semibold pl-4 pr-16"
              style={{
                color: isDropdownVisible ? "#0B963E" : "white",
              }}
            >
              ALL
            </Text>
            {isDropdownVisible ? (
              <AntDesign
                name="up"
                size={20}
                style={{
                  color: "#0B963E",
                }}
              />
            ) : (
              <AntDesign name="down" size={20} color="white" />
            )}
          </TouchableOpacity>

          {isDropdownVisible && (
            <View className="absolute top-9 bg-white border border-zinc-300 z-50">
              <FlatList
                data={dropdownOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity className="flex-row items-center p-2 pr-10 border-b border-zinc-300">
                    <FontAwesome name="bookmark" size={20} color="#0B963E" />
                    <Text className="text-black pl-4">{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
      </View>
      <ScrollView className={` ${isEdit ? "inset-0 bg-black opacity-50" : ""}`}>
        {noteList.map((item) => (
          <NoteItem
            key={item.id}
            second={item.second}
            bookmark={item.bookmark}
            text={item.text}
            id={item.id}
            onTimePress={seekAt}
            openEditNote={openEditNote}
          />
        ))}
      </ScrollView>
      {isEdit && (
        <View className="justify-center items-center p-4">
          <TextInput
            className="border p-2 mb-4 w-full border-zinc-300 rounded-lg text-gray-700"
            value={textEdit}
            onChangeText={setTextEdit}
            multiline
            autoFocus={true}
          />

          <View className="flex-row">
            <TouchableOpacity
              className="px-6 py-2 rounded-lg me-14"
              onPress={() => setIsEdit(!isEdit)}
              style={{ backgroundColor: "#0B963E" }}
            >
              <Text className="text-white">UPDATE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-6 py-2 rounded-lg border border-zinc-300"
              onPress={() => setIsEdit(!isEdit)}
            >
              <Text className="text-black">CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
