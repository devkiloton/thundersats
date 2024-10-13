import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Appbar, Badge, FAB, useTheme } from "react-native-paper";
import { categories } from "../constants/categories";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlaceList } from "../components/PlaceList";
import { CategoriesEnum } from "../constants/categories";
import { firebaseClient, Place } from "../clients/firebase";

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [category, setCategory] = useState<CategoriesEnum | null>(null);
  const [paginationLimit, setPaginationLimit] = useState({
    base: 8,
    increment: 1,
  });
  const [places, setPlaces] = useState<(Place & { id: string })[]>([]);

  const updatePlacesList = () => {
    firebaseClient()
      .places.query({
        limit: paginationLimit.base,
        page: paginationLimit.increment,
        category,
      })
      .then((placesFirebase) => {
        if (placesFirebase == null) return;

        const placesWithId = Object.entries(placesFirebase)
          .filter(([key]) => !places.find((place) => place.id === key))
          .map(([id, place]) => ({ ...place, id }));
        setPlaces([...places, ...placesWithId]);
      });

    setPaginationLimit({
      base: paginationLimit.base,
      increment: paginationLimit.increment + 1,
    });
  };

  useEffect(() => {
    setPlaces([]);
    setPaginationLimit({
      base: 8,
      increment: 1,
    });
    updatePlacesList();
  }, [category]);

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
      <PlaceList places={places} onEndReached={updatePlacesList}>
        <View style={styles.container}>
          <CategoryCarousel
            categories={categories}
            activeCategory={category}
            onChange={setCategory}
          />
        </View>
      </PlaceList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
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
