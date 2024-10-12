import { Appbar, Button } from "react-native-paper";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { useState } from "react";
import { View } from "react-native";
export const WalletScreen = () => {
  const [activeCategory, setActiveCategory] = useState("Bitcoin");
  return (
    <View>
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Wallet" />
      </Appbar.Header>
      <CategoryCarousel
        categories={[
          { name: "Bitcoin", icon: "bitcoin" },
          { name: "Lightning", icon: "lightning-bolt-circle" },
        ]}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
    </View>
  );
};
