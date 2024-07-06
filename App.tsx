import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MainStack } from "./routes/MainStack";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config/firebase-config";
import { getFirestore } from "firebase/firestore";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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
