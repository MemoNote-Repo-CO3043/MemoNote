import { Link } from "expo-router";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRouter } from "expo-router";

const userId = "J1z2TkzcLRs6Xqy66PIn";
const wifiIp = "http://192.168.1.9";

interface EditRecordInfoProps {
  videouri: string;
  noteList: {
    bookmark: string;
    id: number;
    second: number;
    text: string;
  }[];
  closeEdit: () => void;
  clearNote: () => void;
}
const EditRecordInfo: React.FC<EditRecordInfoProps> = ({
  videouri,
  noteList,
  closeEdit,
  clearNote
}) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const player = useVideoPlayer(videouri, (player) => {
    player.loop = false;
    player.play();
    player.currentTime = 0;
  });
  const modifiedNoteList = noteList.map(({ id, ...rest }) => rest);
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;
  const uploadVideo = async () => {
    const formData = new FormData();
    const video = {
      uri: videouri,
      type: "video/mp4",
      name: "video.mp4",
    };
    formData.append("file", video);
    formData.append("name", name);
    formData.append("date", formattedDate);
    formData.append("userId", userId);

    try {
      const response = await fetch(wifiIp + ":3000/record/save_record", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const responseData = await response.json();
      const recordId = responseData.recordId;

      if (response.ok) {
        console.log("Record saved successfully:", responseData);
        const noteFormData = new FormData();
        noteFormData.append("recordId", recordId);
        noteFormData.append("notes", JSON.stringify(modifiedNoteList));

        const noteResponse = await fetch(wifiIp + ":3000/note/addnotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: modifiedNoteList,
            recordId: recordId,
          }),
        });

        const noteResponseData = await noteResponse.json();

        if (noteResponse.ok) {
          console.log("Notes added successfully:", noteResponseData);
        } else {
          console.log("Failed to add notes:", noteResponseData);
        }
      } else {
        console.log("Failed to save record:", responseData);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <View className="flex pt-4 h-full ">
      <Text className="text-2xl font-bold pb-2 text-center">
        Draft Recording
      </Text>
      <View className="w-full h-1/4 px-2">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>
      <View className="w-full p-2 py-5">
        <Text className="font-bold">Name</Text>
        <TextInput
          className="bg-white border border-zinc-300 rounded-lg"
          onChangeText={setName}
        />
      </View>
      <View className="w-full p-2 py-5">
        <Text className="font-bold">Created Date:</Text>
        <Text>{formattedDate}</Text>
      </View>
      <View className="flex-row items-center justify-center flex-1 justify-end">
        <TouchableOpacity
          className="w-40 h-14 rounded-lg flex items-center justify-center me-4"
          style={{ backgroundColor: "#0B963E" }}
          onPress={() => {
            uploadVideo();
            router.push("/");
            closeEdit();
            clearNote();
          }}
        >
          <Text className="text-white">SAVE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push("/");
            closeEdit();
            clearNote();
          }}
          className="w-40 h-14 rounded-lg border border-zinc-300 items-center justify-center"
        >
          <Text className="text-black">DELETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditRecordInfo;
