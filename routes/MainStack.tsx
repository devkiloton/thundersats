import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { useTheme } from "react-native-paper";
import { MapScreen } from "../screens/MapScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { NewPlaceScreen } from "../screens/NewPlaceScreen";

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="New place" component={NewPlaceScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
};
