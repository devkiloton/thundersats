import { useEffect, useState } from "react";
import { firebaseClient, Place } from "../clients/firebase";
import { Appbar, Text } from "react-native-paper";
import { View } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlaceList } from "../components/PlaceList";

export const FavoritesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [favorites, setFavorites] = useState<Place[]>([]);

  useEffect(() => {
    firebaseClient()
      .favorites.get()
      .then((favorites) => {
        if (favorites == null) return;
        console.log(favorites);
        setFavorites(Object.values(favorites));
      });
  }, []);

  return (
    <View>
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Favorites" />
      </Appbar.Header>
      <PlaceList children={<></>} category={null} />
    </View>
  );
};
