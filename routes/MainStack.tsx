import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { useTheme } from "react-native-paper";
import { MapScreen } from "../screens/MapScreen";

const Stack = createStackNavigator();

export const MainStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};
