import { Button } from "react-native-paper";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import * as Location from "expo-location";

export const WelcomeScreen = () => {
  // TODO: DEVELOPMENT PURPOSES ONLY, THIS ENTIRE COMPONENT SHOULD BE REFACTORED
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const email = "xxxx@xxxx.xxx";
  const password = "xxxxxx";

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      navigation.navigate("Home");
    }
  });

  const createAccount = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  };

  return (
    <>
      <Button onPress={() => createAccount()}>Create account</Button>
      <Button onPress={() => signIn()}>Sign in</Button>
    </>
  );
};
