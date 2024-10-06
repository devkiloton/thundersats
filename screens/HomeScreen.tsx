import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { Text } from "react-native-paper";
import { categories } from "../constants/categories";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlaceList } from "../components/PlaceList";

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <View style={styles.header}>
        <FAB
          customSize={96}
          icon="map-marker"
          mode="flat"
          size="large"
          label="Find places"
          style={{ width: "100%" }}
          onPress={() => navigation.navigate("Map")}
        />
      </View>
      <View style={styles.secondaryHeader}>
        <FAB
          customSize={96}
          icon="heart"
          mode="flat"
          size="large"
          label="Favorites"
          style={{ flex: 1 }}
          onPress={() => console.log("Pressed")}
        />
        <FAB
          customSize={96}
          icon="plus"
          mode="flat"
          size="large"
          label="New place"
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("New place")}
        />
      </View>
      <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
        Categories
      </Text>
      <CategoryCarousel
        categories={categories}
        activeCategory={selectedCategory}
        onChange={setSelectedCategory}
      />
      <PlaceList />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 16,
  },
  secondaryHeader: {
    flexDirection: "row",
    gap: 16,
  },
});
