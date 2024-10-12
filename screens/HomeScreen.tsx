import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, Badge, FAB, useTheme } from "react-native-paper";
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
      <Appbar.Header mode="small" elevated>
        <Appbar.Content title="Thundersats" />
        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate("New place")}
        />
        <Appbar.Action
          icon="bookmark-outline"
          onPress={() => navigation.navigate("Favorites")}
        />
        <Badge
          size={8}
          style={{ position: "absolute", top: 24, right: 32, zIndex: 10 }}
        />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
      </Appbar.Header>
      <PlaceList category={selectedCategory}>
        <>
          <View
            style={{
              ...styles.container,
              backgroundColor: theme.colors.background,
            }}
          >
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
