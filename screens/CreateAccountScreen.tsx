import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { Image, View } from "react-native";
import { Appbar, Button, Snackbar, Text, TextInput } from "react-native-paper";
import { validatePassword } from "../utils/validatePassword";
import { validateEmail } from "../utils/vallidateEmail";

export function CreateAccountScreen() {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [height, setHeight] = useState(0);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState({
    visible: false,
    message: "",
  });

  const onConfirm = () => {
    if (!validateEmail(email)) {
      setIsSnackbarVisible({
        visible: true,
        message: "Invalid email",
      });

      setTimeout(() => {
        setIsSnackbarVisible({
          visible: false,
          message: "",
        });
      }, 3000);

      return;
    }

    if (email !== confirmEmail) {
      setIsSnackbarVisible({
        visible: true,
        message: "Emails do not match",
      });

      setTimeout(() => {
        setIsSnackbarVisible({
          visible: false,
          message: "",
        });
      }, 3000);

      return;
    }

    if (!validatePassword(password!)) {
      setIsSnackbarVisible({
        visible: true,
        message:
          "Password must be at least 8 characters long and contain at least 1 special character.",
      });

      setTimeout(() => {
        setIsSnackbarVisible({
          visible: false,
          message: "",
        });
      }, 5000);

      return;
    }
    if (email && confirmEmail && password) {
      navigation.navigate("Verify", { email, password });
    } else {
      setIsSnackbarVisible({
        visible: true,
        message: "Oops! Something went wrong",
      });
    }

    setTimeout(() => {
      setIsSnackbarVisible({
        visible: false,
        message: "",
      });
    }, 3000);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          setHeight(height);
        }}
        mode="small"
      >
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Create account" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: 12,
          marginBottom: height,
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{
            alignSelf: "center",
            width: 100,
            height: 100,
          }}
        />
        <Text
          style={{
            alignSelf: "center",
          }}
        >
          Create an account and start exploring.
        </Text>
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
          label="Confirm Email"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={confirmEmail}
          onChangeText={(text) => setConfirmEmail(text)}
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
            justifyContent: "flex-end",
          }}
        >
          <Button
            mode="contained"
            style={{
              marginHorizontal: 16,
            }}
            contentStyle={{
              justifyContent: "flex-end",
              flexDirection: "row-reverse",
            }}
            onPress={onConfirm}
            icon={"login"}
          >
            Create Account
          </Button>
        </View>
      </View>
      <Snackbar onDismiss={() => {}} visible={isSnackbarVisible.visible}>
        {isSnackbarVisible.message}
      </Snackbar>
    </View>
  );
}
