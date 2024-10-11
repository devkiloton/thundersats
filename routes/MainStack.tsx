import { createStackNavigator } from "@react-navigation/stack";
import { MapScreen } from "../screens/MapScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { MainTab } from "./MainTab";

const Stack = createStackNavigator();

export const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home Tab"
        component={MainTab}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Map"
        component={MapScreen}
      />
    </Stack.Navigator>
  );
};
