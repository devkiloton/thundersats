import { StyleSheet, Text, View } from "react-native";

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});
