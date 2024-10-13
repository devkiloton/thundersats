import { useEffect, useState } from "react";
import { firebaseClient, Place } from "../clients/firebase";
import { Appbar } from "react-native-paper";
import { View } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlaceList } from "../components/PlaceList";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { categories, CategoriesEnum } from "../constants/categories";

export const FavoritesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [places, setPlaces] = useState<(Place & { id: string })[]>([]);
  const [category, setCategory] = useState<CategoriesEnum | null>(null);

  useEffect(() => {
    firebaseClient()
      .favorites.get()
      .then((favorites) => {
        if (favorites == null) return;
        const placesWithId = Object.entries(favorites).map(([id, place]) => ({
          ...place,
          id,
        }));
        setPlaces([...places, ...placesWithId]);
      });
  }, []);

  const filteredPlaces = places.filter((place) =>
    category ? place.category === category : true
  );

  return (
    <View>
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Favorites" />
      </Appbar.Header>
      <View
        style={{
          paddingTop: 16,
        }}
      >
        <PlaceList
          children={
            <CategoryCarousel
              categories={categories}
              activeCategory={category}
              onChange={setCategory}
            />
          }
          places={filteredPlaces}
        />
      </View>
    </View>
  );
};
