import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Map } from "./components/Map";
import { MainStack } from "./routes/MainStack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <MainStack />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
