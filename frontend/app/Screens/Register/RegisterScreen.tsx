import React, { useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const url = "https://memonote.onrender.com/";

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleRegister = async () => {
    setEmailError("");
    setPasswordError("");
    setRegisterError("");

    let isValid = true;

    // Validate email
    if (!email.includes("@")) {
      setEmailError("Invalid email");
      isValid = false;
    }

    // Validate password
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await fetch(url + "user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("token", data.access_token);
        router.push("Screens/Home/HomeScreen");
      } else {
        setRegisterError(data.message || "Registration failed");
      }
    } catch (error) {
      setRegisterError("Error connecting to server");
      console.error("Error registering", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Error Notification */}
      {registerError ? (
        <View style={styles.errorNotification}>
          <Text style={styles.errorNotificationText}>{registerError}</Text>
        </View>
      ) : null}

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.push("Screens/Home/HomeScreen")}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Register Title */}
      <Text style={styles.registerTitle}>Register</Text>

      {/* Email Input */}
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="Email Address"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        onChangeText={(value) => {
          setEmail(value);
          if (emailError) setEmailError("");
        }}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Password Input */}
      <TextInput
        style={[styles.input, passwordError ? styles.inputError : null]}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry={true}
        onChangeText={(value) => {
          setPassword(value);
          if (passwordError) setPasswordError("");
        }}
      />
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/* Register Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      {/* OR Text */}
      <Text style={styles.orText}>Or register in with</Text>

      {/* Social Register Buttons */}
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

      {/* Login Link */}
      <Text style={styles.registerText}>
        Already have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => router.push("Screens/Login/LoginScreen")}
        >
          Login
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
  errorNotification: {
    width: width - 32,
    backgroundColor: "#FFCCCC",
    borderWidth: 1,
    borderColor: "#FF0000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorNotificationText: {
    color: "#FF0000",
    fontSize: 14,
    fontWeight: "bold",
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
  registerTitle: {
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
  inputError: {
    borderColor: "#FF0000",
    backgroundColor: "#FFEAEA",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  registerButton: {
    width: width - 32,
    height: 48,
    backgroundColor: "#28A745",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  registerButtonText: {
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

export default RegisterScreen;
