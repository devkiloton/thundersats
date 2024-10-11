import { ParamListBase, useNavigation } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Appbar, FAB, useTheme } from "react-native-paper";
import { Text } from "react-native-paper";
import { categories } from "../constants/categories";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlaceList } from "../components/PlaceList";
import { CategoriesEnum } from "../constants/categories";

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesEnum | null>(null);

  return (
    <View>
      <Appbar.Header mode="small">
        <Appbar.Content title="Thundersats" />
      </Appbar.Header>
      <PlaceList category={selectedCategory}>
        <>
          <View
            style={{
              ...styles.container,
              backgroundColor: theme.colors.background,
            }}
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
            <Text variant="titleLarge">Explore</Text>
            <CategoryCarousel
              categories={categories}
              activeCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </View>
        </>
      </PlaceList>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  header: {
    gap: 16,
  },
  secondaryHeader: {
    flexDirection: "row",
    gap: 12,
  },
});
