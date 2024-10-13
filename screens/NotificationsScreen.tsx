import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Appbar, List } from "react-native-paper";

export const NotificationsScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={"Notifications"} />
      </Appbar.Header>
      <List.Item
        titleStyle={{ fontSize: 20 }}
        title="Your submition was approved!"
        description="Your submition (Burger King Mannheim) was approved by our team and is now live."
      />
    </View>
  );
};
