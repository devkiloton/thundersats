import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { firebaseClient } from "../clients/firebase";
import { SafeAreaView, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { StackNavigationProp } from "@react-navigation/stack";

export const VerifyScreen = () => {
  const { params } = useRoute();
  const { email, password } = params as { email: string; password?: string };
  const [verificationCode, setVerificationCode] = useState("");
  const [codeId, setCodeId] = useState("");
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    firebaseClient()
      .codes.send(email)
      .then((res) => {
        setCodeId(res.data.docId);
      });
  }, []);

  const verify = () => {
    if (password) {
      firebaseClient()
        .codes.confirm({ codeId, code: verificationCode })
        .then((isVerified) => {
          if (isVerified) {
            signInWithEmailAndPassword(getAuth(), email, password).then(() => {
              navigation.navigate("Home");
            });
          }
        });
    } else {
      firebaseClient()
        .codes.confirm({ codeId, code: verificationCode })
        .then((isVerified) => {
          if (isVerified) {
            createUserWithEmailAndPassword(
              getAuth(),
              email,
              verificationCode
            ).then(() => {
              navigation.navigate("Home");
            });
          }
        });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Preferences" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          gap: 12,
          paddingTop: 100,
        }}
      >
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
    </View>
  );
};
