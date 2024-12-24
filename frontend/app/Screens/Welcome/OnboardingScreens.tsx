import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import OnboardingScreen1 from "./OnboardingScreen1";
import OnboardingScreen2 from "./OnboardingScreen2";
import OnboardingScreen3 from "./OnboardingScreen3";

const OnboardingScreens: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const goToNext = () => setCurrentPage((prev) => prev + 1);
  const goToLast = () => setCurrentPage(2);
  const goToHome = () => navigation.navigate("NextScene");

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <OnboardingScreen1 goToNext={goToNext} goToLast={goToLast} />;
      case 1:
        return <OnboardingScreen2 goToNext={goToNext} goToLast={goToLast} />;
      case 2:
        return <OnboardingScreen3 goToHome={goToHome} goToLast={goToLast} />;
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderPage()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OnboardingScreens;
