import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { NewPlaceScreen } from "../screens/NewPlaceScreen";
import { PlaceScreen } from "../screens/PlaceScreen";
import { GooglePlaceScreen } from "../screens/GooglePlaceScreen";
import { ConfirmPlaceScreen } from "../screens/ConfirmPlaceScreen";

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
        options={{ headerShown: false }}
        name="New place"
        component={NewPlaceScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Google Place"
        component={GooglePlaceScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Confirm Place"
        component={ConfirmPlaceScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Place Home"
        component={PlaceScreen}
      />
    </Stack.Navigator>
  );
};
