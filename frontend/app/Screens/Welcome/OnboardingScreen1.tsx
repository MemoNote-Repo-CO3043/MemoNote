import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

const OnboardingScreen1: React.FC<{
  goToNext: () => void;
  goToLast: () => void;
}> = ({ goToNext, goToLast }) => {
  return (
    <ImageBackground
      source={require("../../../assets/images/image.png")}
      style={styles.background}
    >
      <View style={styles.page}>
        <TouchableOpacity style={styles.skipButton} onPress={goToLast}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/1.png")}
          style={styles.image}
        />
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Welcome to MemoNote, your best buddy for recording videos and taking
          notes
        </Text>
        <TouchableOpacity style={styles.button} onPress={goToNext}>
          <Text style={styles.buttonText}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d3d3d3",
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: "#007BFF",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    height: height,
  },
  page: {
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 32,
    flex: 1,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 32,
    marginTop: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: "medium",
    marginBottom: 10,
    color: "#333",
    fontFamily: "Inter",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 64,
    marginTop: 16,
    color: "#666",
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 64,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#808080",
    fontWeight: "600",
  },
});

export default OnboardingScreen1;
