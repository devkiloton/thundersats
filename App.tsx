import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./routes/MainStack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { app, authInit } from "./hooks/firebase";

export default function App() {
  app();
  authInit();

  return (
    <PaperProvider>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: MD3LightTheme.colors.background,
          },
        }}
      >
        <MainStack />
        <StatusBar style="auto" />
      </NavigationContainer>
    </PaperProvider>
  );
}
