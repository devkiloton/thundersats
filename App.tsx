import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./routes/MainStack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { app } from "./hooks/firebase";

export default function App() {
  app();
  return (
    <PaperProvider>
      <NavigationContainer>
        <MainStack />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
