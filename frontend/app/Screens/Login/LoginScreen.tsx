import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const LoginScreen: React.FC = () => {
  const router = useRouter(); // Use router for navigation

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Login Title */}
      <Text style={styles.loginTitle}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry={true}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* OR Text */}
      <Text style={styles.orText}>Or login in with</Text>

      {/* Social Login Buttons */}
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require("../../../assets/images/google.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#0165E1" }]}
        >
          <Image
            source={require("../../../assets/images/facebook.png")}
            style={styles.socialIcon}
          />
          <Text style={[styles.socialText, { color: "#FFFFFF" }]}>
            Facebook
          </Text>
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => router.push("Screens/Register/Register")}
        >
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 32,
  },
  closeText: {
    fontSize: 24,
    color: "#000",
  },
  logo: {
    marginTop: 32,
    width: "100%",
    height: 244,
    resizeMode: "contain",
  },
  loginTitle: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  input: {
    width: width - 32,
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    width: width - 32,
    height: 48,
    backgroundColor: "#28A745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  orText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - 32,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: (width - 48) / 2,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 8,
  },
  socialText: {
    fontSize: 16,
    color: "#000",
  },
  registerText: {
    fontSize: 14,
    color: "#666",
  },
  registerLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default LoginScreen;
