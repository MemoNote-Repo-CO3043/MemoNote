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

const OnboardingScreen3: React.FC<{
  goToHome: () => void;
  goToLast: () => void;
}> = ({ goToHome, goToLast }) => {
  return (
    <ImageBackground
      source={require("../../../assets/images/image.png")}
      style={styles.background}
    >
      <View style={styles.page}>
        <TouchableOpacity style={styles.skipButton} onPress={goToLast}>
          <Text style={styles.skipButtonText}></Text>
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/3.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Ready to use anytime</Text>
        <Text style={styles.subtitle}>
          Access them through the cloud whenever you need
        </Text>
        <TouchableOpacity style={styles.button} onPress={goToHome}>
          <Text style={styles.buttonText}>GETTING STARTED</Text>
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
    paddingVertical: 32,
    paddingHorizontal: 4,
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
    textAlign: "center",
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
    paddingHorizontal: 32,
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

export default OnboardingScreen3;
