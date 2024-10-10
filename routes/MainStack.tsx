import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { useTheme } from "react-native-paper";
import { MapScreen } from "../screens/MapScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { NewPlaceScreen } from "../screens/NewPlaceScreen";
import { MainTab } from "./MainTab";

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animationTypeForReplace: "push",
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={MainTab}
      />
      <Stack.Screen name="New place" component={NewPlaceScreen} />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Map"
        component={MapScreen}
      />
    </Stack.Navigator>
  );
};
