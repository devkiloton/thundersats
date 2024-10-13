import { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { View } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlaceList } from "../components/PlaceList";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { categories, CategoriesEnum } from "../constants/categories";
import { useFavoriteStore } from "../stores/FavoritesStore";
import { observer } from "mobx-react-lite";

export const FavoritesScreen = observer(() => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [category, setCategory] = useState<CategoriesEnum | null>(null);
  const favoritesStore = useFavoriteStore();

  useEffect(() => {
    favoritesStore.get();
  }, []);

  const filteredPlaces = favoritesStore.favorites.places.filter((place) =>
    category ? place.category === category : true
  );

  return (
    <View
      style={{
        marginBottom: 40,
      }}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Favorites" />
      </Appbar.Header>
      <PlaceList places={filteredPlaces}>
        <View style={{ paddingTop: 16 }}>
          <CategoryCarousel
            categories={categories}
            activeCategory={category}
            onChange={setCategory}
          />
        </View>
      </PlaceList>
    </View>
  );
});
