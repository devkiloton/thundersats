import { Button, MD3Colors, Text, TextInput } from "react-native-paper";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Image, SafeAreaView, View } from "react-native";

export const WelcomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Image
        source={require("../assets/logo.jpg")}
        style={{
          alignSelf: "center",
          width: 100,
          height: 100,
        }}
      />
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
        <Button
          style={{ marginHorizontal: 16 }}
          onPress={() => navigation.navigate("Change Password")}
        >
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
          onPress={() => navigation.navigate("Verify", { email, password })}
          icon={"login"}
        >
          Sign in
        </Button>
      </View>
      <Button
        mode="contained-tonal"
        style={{ marginHorizontal: 16 }}
        onPress={() => navigation.navigate("Create Account")}
      >
        Create account
      </Button>
      <Text
        style={{
          marginHorizontal: 16,
          alignSelf: "center",
          textAlign: "center",
          position: "absolute",
          bottom: 90,
        }}
        variant="bodySmall"
      >
        When creating an account you agree with our{" "}
        <Text
          role="button"
          style={{
            color: MD3Colors.primary50,
          }}
        >
          terms of service
        </Text>{" "}
        &{" "}
        <Text
          role="button"
          style={{
            color: MD3Colors.primary50,
          }}
        >
          privacy policy
        </Text>
        .
      </Text>
    </SafeAreaView>
  );
};
