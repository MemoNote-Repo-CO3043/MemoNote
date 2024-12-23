import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import PagerView from "react-native-pager-view";

const { width, height } = Dimensions.get("window");

const pages = [
  {
    image: require("../../../assets/images/1.png"),
    title: "Welcome",
    subtitle:
      "Welcome to MemoNote, your best buddy for recording videos and taking notes",
  },
  {
    image: require("../../../assets/images/2.png"),
    title: "Take notes and record at the same time",
    subtitle: "Add your notes quickly while are recording video",
  },
  {
    image: require("../../../assets/images/3.png"),
    title: "Ready to use anytime",
    subtitle: "Access them through the cloud whenever you need",
  },
];

const OnboardingScreens: React.FC = () => {
  return (
    <ImageBackground
      source={require("../../../assets/images/image.png")}
      style={styles.background}
    >
      <PagerView style={styles.pagerView} initialPage={0}>
        {pages.map((page, index) => (
          <View key={index} style={[styles.page]}>
            <Image source={page.image} style={styles.image} />
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.subtitle}>{page.subtitle}</Text>
            <Button
              title="Next"
              onPress={() => console.log("Next button pressed")}
            />
          </View>
        ))}
      </PagerView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pagerView: {
    flex: 1,
    width: width,
    height: height,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default OnboardingScreens;
