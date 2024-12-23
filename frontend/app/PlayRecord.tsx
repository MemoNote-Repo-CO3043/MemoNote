import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const wifiIp = "http://192.168.1.9";
export default function PlayRecord() {
  const router = useRouter();

  const [isEdit, setIsEdit] = useState(false);
  const [textEdit, setTextEdit] = useState("");
  const [filterNote, setFilterNote] = useState("ALL");
  const [moreOption, setMoreOption] = useState(false);
  const [noteList, setNoteList] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState("");
  const route = useRoute();
  const { recordId } = route.params;
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
    player.currentTime = 0;
  });
  const seekAt = (second: number) => {
    player.currentTime = second;
  };
  const openEditNote = (text: string, id: string) => {
    setIsEdit(!isEdit);
    setMoreOption(false);
    setDropdownVisible(false);

    setTextEdit(text);
    setEditId(id);
  };
  const confirmUpdateNote = () => {
    setIsEdit(false);
    updateNote(editId, textEdit);
    fetchRecord();
  };
  const updateNote = async (noteId: string, newText: string) => {
    try {
      const response = await fetch(wifiIp + `:3000/note/editnote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: noteId,
          text: newText,
        }),
      });
    } catch (error) {
      console.error("Error updating note:", error);
      Alert.alert("Error", "An error occurred while updating the note");
    }
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
          onPress: () => fetchDeleteRecord(recordId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const deleteNote = (id: string) => {
    Alert.alert(
      "Delete note",
      "Are you sure delete the note?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            fetchDeleteNote(id);
            fetchRecord();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownOptions = ["ALL", "URGENT", "IMPORTANT", "EXAM", "RESEARCH"];

  const fetchRecord = async () => {
    try {
      const response = await fetch(wifiIp + `:3000/record/${recordId}`);
      const data = await response.json();
      if (response.ok) {
        setVideoUrl(data.record.url);
        setNoteList(data.record.notes);
        setName(data.record.name);
        setDate(data.record.date);
      } else {
        Alert.alert("Error", data.error || "Failed to fetch record");
      }
    } catch (error) {
      console.error("Error fetching record:", error);
      Alert.alert("Error", "An error occurred while fetching the record");
    }
  };
  const fetchDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(wifiIp + ":3000/note/deletenote", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: noteId }),
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "An error occurred while deleting the note");
    }
  };
  const fetchDeleteRecord = async (recordId: string) => {
    try {
      const response = await fetch(wifiIp + ":3000/record/deleterecord", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId: recordId }),
      });
    } catch (error) {
      console.error("Error deleting record:", error);
      Alert.alert("Error", "An error occurred while deleting the record");
    }
    router.push("/");
  };

  useEffect(() => {
    fetchRecord();
  }, []);
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
          <Text className="text-2xl font-bold pb-2 ml-auto">{name}</Text>
          <Text>{date}</Text>
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
            disabled={isEdit}
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
            disabled={isEdit}
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
          .filter((item) => filterNote === "ALL" || item.tag == filterNote)
          .map((item) => (
            <NoteItem
              key={item.noteId}
              second={item.timestamp}
              bookmark={item.tag}
              text={item.text}
              id={item.noteId}
              onTimePress={seekAt}
              openEditNote={openEditNote}
              openDeleteNote={deleteNote}
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
              onPress={() => confirmUpdateNote()}
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
        <View className="w-full bg-white-500 p-4 border border-zinc-300">
          <TouchableOpacity className="p-3 flex-row items-center">
            <Feather name="share" size={20} color="black" />
            <Text className="text-2xl font-bold ms-2">Share video</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-3 flex-row items-center">
            <Feather name="edit" size={22} color="black" />
            <Text className="text-2xl font-bold ms-2">Change name</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 flex-row items-center"
            onPress={deleteVideo}
          >
            <MaterialIcons name="delete-outline" size={24} color="black" />
            <Text className="text-2xl font-bold ms-2">Delete video</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
