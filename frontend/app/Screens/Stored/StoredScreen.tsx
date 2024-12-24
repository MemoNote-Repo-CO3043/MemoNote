import React, { useState } from "react";
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

const recordings = [
  {
    id: "3g7jfks",
    recordId: "9UELvWdBNpsb02gf2byk",
    name: "Vật lý 1",
    totalTime: "00:25:15",
    date: "15/11/2024",
  },
  {
    id: "7a3jdkf",
    recordId: "BtN3oWdZKmRvYJ9l8sUX",
    name: "Vật lý 3",
    totalTime: "00:25:15",
    date: "15/11/2024",
  },
  {
    id: "2jf8kd9",
    recordId: "LrKPQ5NYX2oWV8UO9J3VA",
    name: "Vật lý 2",
    totalTime: "00:25:15",
    date: "15/11/2024",
  },
  {
    id: "kf7d93h",
    recordId: "XWLr9VpQgNYKbT25J3UOA",
    name: "Vật lý 3",
    totalTime: "00:25:15",
    date: "15/11/2024",
  },
  {
    id: "3djf7sl",
    recordId: "JrB9VNWXUQoK8LYT2A5Op",
    name: "Vật lý 3",
    totalTime: "00:25:15",
    date: "15/11/2024",
  },
  {
    id: "9dkf73l",
    recordId: "5AOVgPQpJr8cK27T4XxL",
    name: "Vật lý 3",
    totalTime: "00:25:15",
    date: "15/11/2024",
  },
];

const StoredScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const activeScreen = "STORED";
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // To determine which modal to show
  const [newName, setNewName] = useState("");
  const [shareEmail, setShareEmail] = useState("");

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

  const handleChangeName = () => {
    if (selectedItem) {
      selectedItem.name = newName;
    }
    Alert.alert("Success", "Name updated successfully!");
    closeModal();
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
          onPress: () => {
            console.log("Video Deleted:", selectedItem);
            closeModal();
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
  const handleShareVideo = () => {
    Alert.alert("Shared Successfully", `Video shared to ${shareEmail}`);
    closeModal();
  };
  const handleToHome = () => {
    router.replace("Screens/Home/HomeScreen");
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
            source={{ uri: "https://via.placeholder.com/100" }}
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

  return (
    <View style={styles.container}>
      <View
        style={[styles.titleContainer, { paddingLeft: 32, paddingRight: 32 }]}
      >
        <TouchableOpacity style={styles.accountButton}>
          <Ionicons name="reload" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Shared</Text>
        <TouchableOpacity style={styles.accountButton}>
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    marginRight: 12,
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

export default StoredScreen;
