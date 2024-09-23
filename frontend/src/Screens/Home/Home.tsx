import { i18n, LocalizationKey } from "@/Localization";
import { User } from "@/Services";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { Heading, HStack, Spinner } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface IHomeProps {
  data: User | undefined;
  isLoading: boolean;
}

export const Home = (props: IHomeProps) => {
  const { data, isLoading } = props;
  const [response, setResponse] = useState("");

  const fetchData = async () => {
    try {
      const api = process.env.EXPO_PUBLIC_API_URL;
      const response = await axios.get("http://10.0.2.2:3000");
      console.log(api);
      setResponse(response.data);
    } catch (error) {
      console.error(error);
      setResponse("Error: " + error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isLoading ? (
        <HStack space={2} justifyContent="center">
          <Spinner accessibilityLabel="Loading posts" />
          <Heading color="primary.500" fontSize="md">
            {i18n.t(LocalizationKey.LOADING)}
          </Heading>
        </HStack>
      ) : (
        <>
          <Text>{i18n.t(LocalizationKey.HOME)}</Text>
          <Heading color="primary.500" fontSize="md">
            {data?.username}
          </Heading>
          <Text>{response}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
