import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NoteItem from "./components/NoteItem";
import { Alert } from "react-native";
import noteListDummy from "./dummy-data/noteList";
import NoteInput from "./components/NoteInput";
const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function PlayRecord() {
  const [isEdit, setIsEdit] = useState(false);
  const [textEdit, setTextEdit] = useState("");
  const [filterNote, setFilterNote] = useState("ALL");
  const [moreOption, setMoreOption] = useState(false);
  const [noteList, setNoteList] = useState(noteListDummy);
  const [isAddNote, setIsAddNote] = useState(false);
  
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
  const deleteVideo = () => {
    Alert.alert(
      "Delete video",
      "Are you sure delete the video?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          // onPress: () => deleteVideo(videoId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
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
        className={`flex-row pb-3 px-4 pt-1 ${
          isEdit ? "inset-0 bg-black opacity-50" : ""
        }`}
      >
        <View className="flex-1">
          <Text className="text-2xl font-bold pb-2 ml-auto">Giải tích</Text>
          <Text>12/12/2024 - 17:23</Text>
        </View>
        <TouchableOpacity onPress={() => setMoreOption(!moreOption)}>
          <Feather name="more-horizontal" size={24} color="black" />
        </TouchableOpacity>
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

        <View className="flex-1">
          <TouchableOpacity
            className="flex-row w-3/5 p-2 items-center rounded-t-lg ml-auto"
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
              className="text-white font-semibold ms-2"
              style={{
                color: isDropdownVisible ? "#0B963E" : "white",
              }}
            >
              {filterNote}
            </Text>
            {isDropdownVisible ? (
              <AntDesign
                name="up"
                size={20}
                style={{
                  color: "#0B963E",
                }}
                className="ml-auto"
              />
            ) : (
              <AntDesign
                name="down"
                size={20}
                color="white"
                className="ml-auto"
              />
            )}
          </TouchableOpacity>

          {isDropdownVisible && (
            <View className="absolute w-3/5 top-10 right-0 bg-white border border-zinc-300 z-50">
              <FlatList
                data={dropdownOptions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center p-2 border-b border-zinc-300"
                    onPress={() => {
                      setFilterNote(item);
                      setDropdownVisible(!isDropdownVisible);
                    }}
                  >
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
      <ScrollView className={`${isEdit ? "inset-0 bg-black opacity-50" : ""}`}>
        {noteList
          .filter((item) => filterNote === "ALL" || item.bookmark == filterNote)
          .map((item) => (
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
        <View className="bg-white justify-center items-center p-4 pb-8">
          <TextInput
            className="border h-20 p-2 mb-4 w-full border-zinc-300 rounded-lg text-gray-700"
            value={textEdit}
            onChangeText={setTextEdit}
            multiline
            autoFocus={true}
            numberOfLines={3}
            textAlignVertical="top"
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
      {moreOption && (
        <View className="w-full bg-white-500 p-4">
          <TouchableOpacity className="p-2">
            <Text>Share video</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Text>Change name</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-2" onPress={deleteVideo}>
            <Text>Delete video</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
