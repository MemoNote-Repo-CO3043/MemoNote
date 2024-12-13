import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { IconButton } from "react-native-paper";

const data = [
  { label: "ALL", value: "ALL" },
  { label: "URGENT", value: "URGENT" },
  { label: "IMPORTANT", value: "IMPORTANT" },
  { label: "EXAM", value: "EXAM" },
  { label: "RESEARCH", value: "RESEARCH" },
];

const DropdownComponent = () => {
  const [value, setValue] = useState<string | null>(null);

  interface Item {
    label: string;
    value: string;
  }

  const renderItem = (item: Item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      selectedTextStyle={styles.selectedTextStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholderStyle={{ color: "white" }}
      value={value}
      iconColor="white"
      onChange={(item) => {
        setValue(item.value);
      }}
      renderLeftIcon={() => (
        <IconButton
          style={styles.icon}
          iconColor="white"
          icon="bookmark"
          size={20}
        />
      )}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    width: "50%",
    height: 40,
    backgroundColor: "#0B963E",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  icon: {
    marginRight: 2,
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "white",
  },
});
