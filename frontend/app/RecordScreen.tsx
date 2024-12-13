import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import "../global.css";
import DropdownComponent from "./components/DropdownComponent";
import NoteItem from "./components/NoteItem";
import RecordButton from "./components/RecordButton";
import saveVideoToAlbum from "./utils/mediaLibrary";

export default function CameraNoteApp() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedBookmark, setSelectedBookmark] = useState<string>("ALL");
  const [notes, setNotes] = useState([]);

  const toggleInput = () => {
    setIsNoteVisible(!isNoteVisible);
  };

  const openEditNote = (text: string) => {
    setIsNoteVisible(!isNoteVisible);
    setNoteText(text);
  };

  // Comprehensive permission request for Android 13
  const requestAllPermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      // Camera Permission
      if (!cameraPermission?.granted) {
        const cameraResult = await requestCameraPermission();
        if (!cameraResult.granted) {
          Alert.alert(
            "Camera Permission",
            "Camera access is required to record videos."
          );
          return false;
        }
      }

      // Microphone Permission for audio recording
      if (!audioPermission?.granted) {
        const audioResult = await requestAudioPermission();
        if (!audioResult.granted) {
          Alert.alert(
            "Audio Permission",
            "Microphone access is required for video with audio."
          );
          return false;
        }
      }

      // Media Library Permission
      if (!mediaPermission?.granted) {
        const mediaResult = await requestMediaPermission();
        if (!mediaResult.granted) {
          Alert.alert(
            "Media Permission",
            "Media library access is required to save videos."
          );
          return false;
        }
      }

      // Additional Android 13 specific media permissions
      if (Platform.Version >= 33) {
        const readMediaVideoPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
        );
        const readMediaAudioPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
        );

        if (
          readMediaVideoPermission !== PermissionsAndroid.RESULTS.GRANTED ||
          readMediaAudioPermission !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert(
            "Media Access",
            "Required media permissions were not granted."
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Permission request error:", error);
      Alert.alert("Permission Error", "Failed to request permissions.");
      return false;
    }
  };

  // Modify useEffect to use comprehensive permission request
  useEffect(() => {
    requestAllPermissions();
  }, []);

  // Handle video recording (updated)
  const handleRecordPress = async () => {
    // Ensure all permissions are granted before recording
    const permissionsGranted = await requestAllPermissions();
    if (!permissionsGranted) return;

    if (cameraRef.current) {
      try {
        if (isRecording) {
          // Stop recording
          setIsRecording(false);
          cameraRef.current.stopRecording();
        } else {
          // Start recording
          setIsRecording(true);

          setTimer(0);
          timerRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
          }, 1000);

          await cameraRef.current
            .recordAsync()
            .then(async (video) => {
              setIsRecording(false);
              if (video && video.uri) {
                await handleSaveVideo(video.uri);
              }
            })
            .catch((error) => {
              console.error("Recording error:", error);
              setIsRecording(false);
              Alert.alert("Recording Error", error.message);
            });
        }
      } catch (error) {
        console.error("Error in recording:", error);
        setIsRecording(false);
        Alert.alert("Recording Error", "Failed to record video");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const handleSaveNote = () => {
    const newNote = {
      second: timer,
      bookmark: selectedBookmark,
      text: noteText,
      id: notes.length + 1,
    };
    console.log(newNote);
    setNotes([...notes, newNote]);
    setIsNoteVisible(false);
    setNoteText("");
  };

  // Save video to media library
  const handleSaveVideo = async (uri: string) => {
    const permissionsGranted = await requestAllPermissions();
    if (!permissionsGranted) return;

    await saveVideoToAlbum(uri);
  };

  // If permissions are not granted, return null
  if (
    !cameraPermission?.granted ||
    !mediaPermission?.granted ||
    !audioPermission?.granted
  ) {
    return <View />;
  }

  function toggleCameraType() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <Text
        className="text-black bg-white text-3xl font-bold text-center
      h-[5%] flex align-middle items-start"
      >
        Recording
      </Text>
      <View className="h-[65%] w-full">
        <CameraView
          className="w-full h-full"
          style={{
            flex: 1,
          }}
          facing={facing}
          ref={cameraRef}
          ratio="1:1"
          videoQuality="1080p"
          mode="video"
        />
        {!isNoteVisible && (
          <RecordButton
            isRecording={isRecording}
            handleRecordPress={handleRecordPress}
          />
        )}
        {isRecording && (
          <View className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <Text className="text-white text-3xl">{formatTime(timer)}</Text>
          </View>
        )}
      </View>
      {!isNoteVisible && (
        <View className="w-full h-[30%]" style={{ flex: 1 }}>
          <View className="w-full p-3 h-16 flex flex-row justify-between items-center border-b-2 border-gray-200">
            <Button
              labelStyle={{ fontSize: 17, marginTop: 8 }}
              mode="contained"
              buttonColor="#0B963E"
              textColor="white"
              onPress={toggleInput}
              icon="plus"
              className="w-28 h-10"
            >
              NOTE
            </Button>
            <DropdownComponent onSelect={setSelectedBookmark} />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {notes.map((item) => (
              <NoteItem
                key={item.id}
                second={item.second}
                bookmark={item.bookmark}
                text={item.text}
                id={item.id}
                openEditNote={openEditNote}
                openDeleteNote={() => {}}
              />
            ))}
          </ScrollView>
        </View>
      )}
      {isNoteVisible && (
        <View className="px-3 py-2">
          <TextInput
            className="h-20 px-2 bg-white rounded-md border border-gray-300"
            placeholder="Write your note here..."
            value={noteText}
            onChangeText={setNoteText}
            autoFocus
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={{ backgroundColor: "#EEE" }}
          />
          <View className="flex-row justify-around space-x-2 mt-3">
            <Button
              labelStyle={{ fontSize: 16 }}
              mode="contained"
              buttonColor="#0B963E"
              textColor="white"
              onPress={handleSaveNote}
              className="w-44"
              style={{ borderRadius: 8 }}
            >
              UPDATE
            </Button>
            <Button
              labelStyle={{ fontSize: 16 }}
              textColor="black"
              mode="outlined"
              onPress={() => {
                setIsNoteVisible(false);
                setNoteText("");
              }}
              className="w-44"
              style={{ borderRadius: 8, borderColor: "#BDBDBD" }}
            >
              CANCEL
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
