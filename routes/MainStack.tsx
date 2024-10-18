import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { MapScreen } from "../screens/MapScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { MainTab } from "./MainTab";
import { PlaceScreen } from "../screens/PlaceScreen";
import { FavoritesScreen } from "../screens/FavoritesScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { LoadScreen } from "../screens/LoadScreen";
import { VerifyScreen } from "../screens/VerifyScreen";
import { ChangePasswordScreen } from "../screens/ChangePasswordScreen";
import { CreateAccountScreen } from "../screens/CreateAccountScreen";

const Stack = createStackNavigator();

export const MainStack = () => {
  const [user, setUser] = useState<boolean | null>(null);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      setUser(true);
      navigation.navigate("Home Tab");
    } else {
      setUser(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    }
  });

  return (
    <Stack.Navigator>
      {user === null && (
        <Stack.Screen
          options={{ headerShown: false }}
          name="Decision"
          component={LoadScreen}
        />
      )}
      {!user && (
        <Stack.Screen
          options={{ headerShown: false }}
          name="Welcome"
          component={WelcomeScreen}
        />
      )}
      <Stack.Screen
        options={{ headerShown: false }}
        name="Create Account"
        component={CreateAccountScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Change Password"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Verify"
        component={VerifyScreen}
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
      <Stack.Screen
        options={{ headerShown: false }}
        name="Favorites"
        component={FavoritesScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Place"
        component={PlaceScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Notifications"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
};
