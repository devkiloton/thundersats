import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Image, View } from "react-native";
import { Appbar, Button, Snackbar, Text, TextInput } from "react-native-paper";

export const ChangePasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [height, setHeight] = useState(0);
  const [isSnackbarVisible, setSnackbarVisible] = useState({
    visible: false,
    message: "",
  });

  const onConfirm = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigation.goBack();
        setSnackbarVisible({
          visible: true,
          message: "Email sent",
        });
      })
      .catch((error) => {
        setSnackbarVisible({
          visible: true,
          message: "Oops! Something went wrong",
        });
      });

    setTimeout(() => {
      setSnackbarVisible({
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
        <Appbar.Content title="Change password" />
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
          We'll send you an email to reset your password.
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
            Confirm
          </Button>
        </View>
      </View>
      <Snackbar onDismiss={() => {}} visible={isSnackbarVisible.visible}>
        {isSnackbarVisible.message}
      </Snackbar>
    </View>
  );
};
