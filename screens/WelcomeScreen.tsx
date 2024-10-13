import { Button, TextInput } from "react-native-paper";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { SafeAreaView, View } from "react-native";

export const WelcomeScreen = () => {
  // TODO: DEVELOPMENT PURPOSES ONLY, THIS ENTIRE COMPONENT SHOULD BE REFACTORED
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // const email = "xxxx@xxxx.xxx";
  // const password = "xxxxxx";

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      navigation.navigate("Home Tab");
    }
  });

  const createAccount = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        gap: 12,
      }}
    >
      <TextInput
        mode="outlined"
        label="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{ marginHorizontal: 16 }}
      />
      <TextInput
        mode="outlined"
        label="Password"
        secureTextEntry={!isPasswordVisible}
        right={
          isPasswordVisible ? (
            <TextInput.Icon
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              icon={"eye"}
            />
          ) : (
            <TextInput.Icon
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              icon={"eye-off"}
            />
          )
        }
        keyboardType="visible-password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={{ marginHorizontal: 16 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button style={{ marginHorizontal: 16 }} onPress={() => {}}>
          Change password
        </Button>
        <Button
          mode="contained"
          style={{
            marginHorizontal: 16,
          }}
          contentStyle={{
            flexDirection: "row-reverse",
          }}
          onPress={() => signIn()}
          icon={"login"}
        >
          Sign in
        </Button>
      </View>
      <Button
        mode="contained-tonal"
        style={{ marginHorizontal: 16 }}
        onPress={() => createAccount()}
      >
        Create account
      </Button>
    </SafeAreaView>
  );
};
