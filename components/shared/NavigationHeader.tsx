import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackHeaderProps, StackNavigationProp } from "@react-navigation/stack";
import { Appbar } from "react-native-paper";

export const NavigationHeader = (props: StackHeaderProps) => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const previousScreen = props?.back?.title;

  return (
    <Appbar.Header>
      <Appbar.BackAction
        onPress={() => navigation.navigate(previousScreen ?? "Home Tab")}
      />
      <Appbar.Content title="Add a new place" />
    </Appbar.Header>
  );
};
