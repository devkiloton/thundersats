import { Appbar } from "react-native-paper";
import { Place } from "../clients/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { useFavoriteStore } from "../stores/FavoritesStore";

export const PlaceScreen = observer(() => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { place } = params as { place: Place & { id: string } };
  const favoritesStore = useFavoriteStore();
  const isFavorite = favoritesStore.favorites.ids.includes(place.id);
  const bookMarkIcon = isFavorite ? "bookmark" : "bookmark-outline";

  return (
    <Appbar.Header mode="small" elevated>
      <Appbar.BackAction onPress={navigation.goBack} />
      <Appbar.Content title={place.name} />
      <Appbar.Action
        icon={bookMarkIcon}
        onPress={() =>
          isFavorite
            ? favoritesStore.delete(place.id)
            : favoritesStore.create(place.id)
        }
      />
    </Appbar.Header>
  );
});
