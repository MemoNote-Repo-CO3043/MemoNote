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
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../global.css";

export default function CameraNoteApp() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
  const [note, setNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

          await cameraRef.current
            .recordAsync()
            .then(async (video) => {
              setIsRecording(false);
              if (video && video.uri) {
                await saveVideo(video.uri);
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

  // Save video to media library (enhanced)
  const saveVideo = async (uri: string) => {
    try {
      // Ensure all permissions are granted
      const permissionsGranted = await requestAllPermissions();
      if (!permissionsGranted) return;

      const asset = await MediaLibrary.createAssetAsync(uri);

      // Create album if it doesn't exist
      let album = await MediaLibrary.getAlbumAsync("MemoNote");
      if (!album) {
        album = await MediaLibrary.createAlbumAsync("MemoNote", asset);
      }

      // Save the video to the album
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);

      Alert.alert("Success", "Video saved to MemoNote album");
      console.log("Video saved:", uri);
    } catch (error) {
      console.error("Failed to save video:", error);
      Alert.alert("Save Error", "Could not save the video");
    }
  };

  // Save note function
  const saveNote = () => {
    if (note.trim()) {
      Alert.alert("Note Saved", note);
      console.log("Note saved:", note);
      // Here you could implement actual note saving logic
      // For example, storing in AsyncStorage or sending to a backend
    } else {
      Alert.alert("Empty Note", "Please write something before saving");
    }
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
    <SafeAreaView className="flex-1 bg-black">
      <Text className="text-black bg-white text-3xl font-bold text-center
      h-[36px] flex align-middle items-start">
        Recording
      </Text>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        ratio="1:1"
        mode="video"
      ></CameraView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.noteContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Write a note..."
          value={note}
          onChangeText={setNote}
          multiline={true}
          numberOfLines={3}
        />

        <TouchableOpacity
          className="p-2.5 items-center my-1.5 rounded-md"
          style={[{ backgroundColor: isRecording ? "red" : "blue" }]}
          onPress={handleRecordPress}
        >
          <Text className="text-white font-bold">
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-900 p-2.5 items-center my-1.5 rounded-md"
          onPress={saveNote}
        >
          <Text className="text-white font-bold">Save Note</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 16,
  },
  cameraToggleButton: {
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  noteContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  input: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 5,
  },
});
