import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import { HomeStack } from "./HomeStack";
import { Preferences } from "../screens/Preferences";
import { WalletScreen } from "../screens/WalletScreen";
import { MapScreen } from "../screens/MapScreen";

const WalletRoute = () => <Text>Recents</Text>;

export const MainTab = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "explore",
      title: "Explore",
      focusedIcon: "map",
      unfocusedIcon: "map-outline",
    },
    // {
    //   key: "wallet",
    //   title: "Wallet",
    //   focusedIcon: "wallet",
    //   unfocusedIcon: "wallet-outline",
    // },
    {
      key: "preferences",
      title: "Preferences",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeStack,
    explore: MapScreen,
    preferences: Preferences,
    // wallet: WalletScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      sceneAnimationEnabled
      sceneAnimationType="shifting"
    />
  );
};
