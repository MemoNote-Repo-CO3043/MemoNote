import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { useVideoPlayer, VideoView } from "expo-video";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export default function PlayRecord() {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    player.currentTime = 100;
  });

  return (
    <View style={styles.container}>
      {/* <Link href="/" style={styles.link}>
        <TouchableOpacity>
          <View>
            <Icon name="arrow-left" size={30} color="#000" />
          </View>
        </TouchableOpacity>
      </Link> */}

      <View style={styles.contentContainer}>
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  link: {
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
});
