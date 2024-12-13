import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

const saveVideoToAlbum = async (uri: string) => {
  try {
    const video_asset = await MediaLibrary.createAssetAsync(uri);

    let album = await MediaLibrary.getAlbumAsync("MemoNote");
    if (!album) {
      album = await MediaLibrary.createAlbumAsync("MemoNote", video_asset);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync(
        [video_asset],
        album,
        false
      );
    }

    Alert.alert("Success", "Video saved to MemoNote album");
    console.log("Video saved:", uri);
  } catch (error) {
    Alert.alert("Error", "Failed to save video");
    console.error("Error saving video:", error);
  }
};

export default saveVideoToAlbum;
