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
import * as Sentry from "@sentry/react-native";

const url = "https://memonote.onrender.com/";

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const activeScreen = "HOME";
  const [selectedItem, setSelectedItem] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [modalType, setModalType] = useState(null); // To determine which modal to show
  const [newName, setNewName] = useState("");
  const [shareEmail, setShareEmail] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      if ((await AsyncStorage.getItem("token")) === null) {
        router.push("Screens/Login/LoginScreen");
      }
    };
    checkToken();
  }, []);
  const fetchRecordings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${url}record/record/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecordings(data.records);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  useEffect(() => {
    fetchRecordings();
  }, []);
  const openModal = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
    setModalVisible(true);
    if (type === "changeName") setNewName(item.name);
    if (type === "shareVideo") setShareEmail("");
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setModalType(null);
    setNewName("");
    setShareEmail("");
  };

  const handleChangeName = async () => {
    try {
      if (selectedItem) {
        selectedItem.name = newName;
        const response = await fetch(`${url}record/changename`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recordId: selectedItem.recordId, newName }),
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "Name updated successfully!");
          closeModal();
        } else {
          throw new Error(data.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const handleRecord = () => {
    router.push("/RecordScreen");
  };

  const handleDeleteVideo = () => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${url}record/deleterecord`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ recordId: selectedItem.recordId }),
              });
              const data = await response.json();
              if (response.ok) {
                fetchRecordings();
                Alert.alert("Success", "Video deleted successfully!");
                closeModal();
              } else {
                throw new Error(data.message);
              }
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePlayRecording = (recordId: string) => {
    // go to the recording screen
    router.push(`/PlayRecord?recordId=${recordId}`);
  };
  const handleShareVideo = async () => {
    try {
      const response = await fetch(`${url}record/sharedrecords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recordId: selectedItem.recordId,
          email: shareEmail,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Shared Successfully", `Video shared to ${shareEmail}`);
        closeModal();
      } else {
        Alert.alert("Error", data.message);
        return;
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      Sentry.captureException(error);
    }
  };
  const handleToStored = () => {
    router.replace("Screens/Stored/StoredScreen");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => openModal(item, "menu")}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>
      </View>

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
          <Text>
            <Text style={styles.label}>Total time: </Text>
            <Text style={styles.detail}>{item.totalTime}</Text>
          </Text>
          <Text>
            <Text style={styles.label}>Date: </Text>
            <Text style={styles.detail}>{item.date}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("Screens/Login/LoginScreen");
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View></View>
        <Text style={styles.title}>Recordings</Text>
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
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        style={styles.modalContainer}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        {modalType === "menu" && (
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => openModal(selectedItem, "shareVideo")}
            >
              <Ionicons name="share-social-outline" size={24} color="black" />
              <Text style={styles.modalText}>Share Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => openModal(selectedItem, "changeName")}
            >
              <Ionicons name="create-outline" size={24} color="black" />
              <Text style={styles.modalText}>Change Name</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleDeleteVideo}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
              <Text style={[styles.modalText, { color: "red" }]}>
                Delete Video
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {modalType === "changeName" && (
          <View style={styles.modalContent}>
            <Text style={styles.editLabel}>Enter New Name</Text>
            <TextInput
              mode="flat"
              textColor="black"
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
              placeholder="New Name"
            />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[styles.saveButton, { width: "48%" }]}
                onPress={handleChangeName}
              >
                <Text style={styles.saveButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { width: "48%" }]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {modalType === "shareVideo" && (
          <View style={styles.modalContent}>
            <Text style={styles.editLabel}>Enter Email to Share</Text>
            <TextInput
              value={shareEmail}
              onChangeText={setShareEmail}
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              mode="flat"
              textColor="black"
            />
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[styles.saveButton, { width: "48%" }]}
                onPress={handleShareVideo}
              >
                <Text style={styles.saveButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { width: "48%" }]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="home"
            size={28}
            color={activeScreen === "HOME" ? "green" : "black"}
          />
          <Text
            style={[
              styles.navText,
              { color: activeScreen === "HOME" ? "green" : "black" },
            ]}
          >
            HOME
          </Text>
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
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleToStored()}
        >
          <Ionicons name="folder-outline" size={28} color="gray" />
          <Text style={[styles.navText, { color: "gray" }]}>STORED</Text>
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
    marginLeft: 32,
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
    marginTop: 4,
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

export default HomeScreen;
