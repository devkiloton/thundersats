import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Map } from "./components/Map";
import { MainStack } from "./routes/MainStack";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
      {/* <Map /> */}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
