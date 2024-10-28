import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { firebaseClient } from "../clients/firebase";
import { Image, SafeAreaView, View } from "react-native";
import { Appbar, Button, Snackbar, Text, TextInput } from "react-native-paper";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";
import { validateEmail } from "../utils/vallidateEmail";
import { validatePassword } from "../utils/validatePassword";

export const VerifyScreen = () => {
  const { params } = useRoute();
  const { email, password } = params as {
    email: string;
    password?: string;
    operation: "signin" | "signup" | "delete" | "update-password";
  };
  const [verificationCode, setVerificationCode] = useState("");
  const [codeId, setCodeId] = useState("");
  const [height, setHeight] = useState(0);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState({
    visible: false,
    message: "",
  });
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    firebaseClient()
      .codes.send(email)
      .then((res) => {
        setCodeId(res.data.docId);
      });
  }, []);

  const verify = () => {
    // If password is present, we are signing in
    if (password) {
      firebaseClient()
        .codes.confirm({ codeId, code: verificationCode })
        .then((isVerified) => {
          if (isVerified) {
            signInWithEmailAndPassword(getAuth(), email, password)
              .then(() => {
                navigation.navigate("Home");
              })
              .catch((error) => {
                setIsSnackbarVisible({
                  visible: true,
                  message: "Oops! Something went wrong",
                });
              });
          }
        });
    }
    // If password is not present, we are signing up
    else {
      firebaseClient()
        .codes.confirm({ codeId, code: verificationCode })
        .then((isVerified) => {
          if (isVerified) {
            createUserWithEmailAndPassword(getAuth(), email, verificationCode)
              .then(() => {
                navigation.navigate("Home");
              })
              .catch((error) => {
                setIsSnackbarVisible({
                  visible: true,
                  message: "Oops! Something went wrong",
                });
              });
          }
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
        gap: 12,
      }}
    >
      <Appbar.Header
        onLayout={({ nativeEvent }) => {
          const { height } = nativeEvent.layout;
          setHeight(height);
        }}
        mode="small"
        elevated
      >
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="2FA" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginBottom: height,
          gap: 12,
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
            textAlign: "center",
          }}
        >
          We have sent a verification code to {email}. Please enter it below.
        </Text>
        <TextInput
          mode="outlined"
          label="Verification code"
          keyboardType="number-pad"
          style={{ marginHorizontal: 16 }}
          value={verificationCode}
          onChangeText={(text) => setVerificationCode(text)}
        />
        <Button
          mode="contained"
          disabled={verificationCode.length !== 6}
          onPress={verify}
          style={{ marginHorizontal: 16 }}
        >
          Verify
        </Button>
      </View>
      <Snackbar onDismiss={() => {}} visible={isSnackbarVisible.visible}>
        {isSnackbarVisible.message}
      </Snackbar>
    </View>
  );
};
