import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ip = "192.168.68.104";

const StoredScreen = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    const checkToken = async () => {
      if ((await AsyncStorage.getItem("token")) === null) {
        router.push("Screens/Login/LoginScreen");
      }
    };
    checkToken();
  }, []);
  const handleRecord = () => {
    router.push("/RecordScreen");
  };

  const handlePlayRecording = (recordId: string) => {
    router.push(`/PlayRecord?recordId=${recordId}`);
  };
  const handleToHome = () => {
    router.replace("Screens/Home/HomeScreen");
  };
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.push("Screens/Login/LoginScreen");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTitle}></View>

      <TouchableOpacity
        style={styles.content}
        onPress={() => {
          handlePlayRecording(item.recordId);
        }}
      >
        <View style={styles.thumbnailContent}>
          <Image
            source={require("../../../assets/images/background.jpg")}
            style={styles.thumbnail}
          />
        </View>
        <View style={styles.cardContent}>
          <Text>
            <Text style={styles.label}>Name: </Text>
            <Text style={styles.detail}>{item.name}</Text>
          </Text>
          {/* <Text>
            <Text style={styles.label}>Total time: </Text>
            <Text style={styles.detail}>{item.totalTime}</Text>
          </Text> */}
          <Text>
            <Text style={styles.label}>Date: </Text>
            <Text style={styles.detail}>{item.date}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  const fetchRecordings = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`http://${ip}:3000/record/shared/record`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      setRecordings(data.records);
    } else {
      Alert.alert(data.message || "Error getting recordings");
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);
  return (
    <View style={styles.container}>
      <View
        style={[styles.titleContainer, { paddingLeft: 32, paddingRight: 32 }]}
      >
        <TouchableOpacity
          style={styles.accountButton}
          onPress={fetchRecordings}
        >
          <Ionicons name="reload" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Shared</Text>
        <TouchableOpacity style={styles.accountButton} onPress={handleLogout}>
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.recordId}
        style={{ flexGrow: 0, height: 600 }}
      />
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleToHome()}>
          <Ionicons name="home-outline" size={28} color="gray" />
          <Text style={[styles.navText, { color: "gray" }]}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <TouchableOpacity
            style={[styles.recordButton, { backgroundColor: "darkgreen" }]}
            onPress={() => handleRecord()}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
          <Text
            style={[
              styles.navText,
              {
                color: "gray",
              },
            ]}
          >
            RECORD
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="folder" size={28} color="green" />
          <Text style={[styles.navText, { color: "green" }]}>STORED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accountButton: {
    marginRight: 0,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",

    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  card: {
    width: "90%",
    height: 114,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
  },
  cardTitle: {
    width: "100%",
    height: 24,
    backgroundColor: "#4AE182",
    marginBottom: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  moreButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 8,
  },
  thumbnailContent: {
    width: "40%",
    alignItems: "center",
  },
  thumbnail: {
    width: 108,
    height: 64,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginTop: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 97,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#555",
  },
  recordButton: {
    backgroundColor: "green",
    borderRadius: 50,
    width: 64,
    position: "absolute",
    bottom: 24,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalText: {
    marginLeft: 16,
    fontSize: 18,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#EEEEEE",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default StoredScreen;
