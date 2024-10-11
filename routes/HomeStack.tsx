import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { NewPlaceScreen } from "../screens/NewPlaceScreen";
import { NavigationHeader } from "../components/shared/NavigationHeader";

const Stack = createStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{ header: NavigationHeader }}
        name="New place"
        component={NewPlaceScreen}
      />
    </Stack.Navigator>
  );
};
