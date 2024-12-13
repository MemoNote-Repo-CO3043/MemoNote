import React from "react";
import { TextInput, View } from "react-native";
import { Button } from "react-native-paper";

interface NoteInputProps {
  noteText: string;
  setNoteText: (text: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  handleSaveNote: () => void;
}

const NoteInput: React.FC<NoteInputProps> = ({
  noteText,
  setNoteText,
  setIsTyping,
  handleSaveNote,
}) => {
  return (
    <View className="px-3 py-2">
      <TextInput
        className="h-20 px-2 bg-white rounded-md border border-gray-300"
        placeholder="Write your note here..."
        value={noteText}
        onChangeText={setNoteText}
        autoFocus
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        style={{ backgroundColor: "#EEE" }}
      />
      <View className="flex-row justify-around space-x-2 mt-3">
        <Button
          labelStyle={{ fontSize: 16 }}
          mode="contained"
          buttonColor="#0B963E"
          textColor="white"
          onPress={handleSaveNote}
          className="w-44"
          style={{ borderRadius: 8 }}
        >
          UPDATE
        </Button>
        <Button
          labelStyle={{ fontSize: 16 }}
          textColor="black"
          mode="outlined"
          onPress={() => {
            setIsTyping(false);
            setNoteText("");
          }}
          className="w-44"
          style={{ borderRadius: 8, borderColor: "#BDBDBD" }}
        >
          CANCEL
        </Button>
      </View>
    </View>
  );
};

export default NoteInput;
