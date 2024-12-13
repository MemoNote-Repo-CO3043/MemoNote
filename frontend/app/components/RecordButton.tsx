import React from 'react';
import { TouchableOpacity } from 'react-native';

interface RecordButtonProps {
  isRecording: boolean;
  handleRecordPress: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, handleRecordPress }) => (
  <TouchableOpacity
    className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 
    size-24 rounded-full flex items-center 
    justify-center border-8 border-[#e2e2e2] ${
      isRecording ? "bg-red-500" : "bg-white"
    }`}
    onPress={handleRecordPress}
  />
);

export default RecordButton;