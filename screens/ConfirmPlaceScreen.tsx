import { StyleSheet, View } from "react-native";
import { Appbar, Button, Switch, Text } from "react-native-paper";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { useState } from "react";
import { categories, CategoriesEnum } from "../constants/categories";
import { firebaseClient } from "../clients/firebase";
import { getAuth } from "firebase/auth";
import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { GooglePlaceDetails } from "../types/google-place-details";
import { StackNavigationProp } from "@react-navigation/stack";

export function ConfirmPlaceScreen() {
  const [hasBitcoin, setHasBitcoin] = useState(false);
  const [hasLighting, setHasLighting] = useState(false);
  const [hasCryptos, setHasCryptos] = useState(false);
  const [category, setCategory] = useState<CategoriesEnum | null>(null);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const { params } = useRoute();
  const selectedPlaceDetails = params as GooglePlaceDetails & {
    place_id: string;
  };

  const createPlace = () => {
    if (category === null || selectedPlaceDetails === null) {
      console.error(
        "category, selectedPlaceDetails or selectedPlace hook is null!"
      );
      return;
    }

    const uid = getAuth().currentUser?.uid;

    if (uid == null) {
      console.error("User is not logged in!");
      return;
    }

    firebaseClient().places.create({
      hasBitcoin,
      hasCryptos,
      hasLighting,
      category,
      address: selectedPlaceDetails.result.formatted_address,
      locationIdGoogle: selectedPlaceDetails?.place_id,
      location: {
        lat: selectedPlaceDetails.result.geometry.location.lat,
        lng: selectedPlaceDetails.result.geometry.location.lng,
      },
      name: selectedPlaceDetails.result.name,
      ratingGoogle: selectedPlaceDetails.result.user_ratings_total ?? 0,
      phone: selectedPlaceDetails?.result.international_phone_number ?? null,
      website: selectedPlaceDetails?.result.website ?? null,
      priceLevel: selectedPlaceDetails?.result.price_level ?? null,
      rating: selectedPlaceDetails?.result.rating ?? null,
      wheelchairAccessibleEntrance:
        selectedPlaceDetails?.result.wheelchair_accessible_entrance ?? null,
      coverPhotoReference:
        selectedPlaceDetails?.result.photos?.[0]?.photo_reference ?? null,
      isVerified: false,
      submittedBy: uid,
      createdAt: Date.now(),
      views: 1,
    });
    navigation.navigate("Home");
  };

  return (
    <>
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Confirmation" />
      </Appbar.Header>
      <View style={styles.container}>
        <View style={styles.switch}>
          <Text>Do they accept Bitcoin?</Text>
          <Switch value={hasBitcoin} onValueChange={setHasBitcoin} />
        </View>
        <View style={styles.switch}>
          <Text>Do they accept Bitcoin Lighting?</Text>
          <Switch value={hasLighting} onValueChange={setHasLighting} />
        </View>
        <View style={styles.switch}>
          <Text>Do they accept other cryptos?</Text>
          <Switch value={hasCryptos} onValueChange={setHasCryptos} />
        </View>
        <Text>Choose some category</Text>
        <CategoryCarousel
          categories={categories}
          activeCategory={category}
          onChange={setCategory}
        />
        <Button icon="send" mode="contained" onPress={() => createPlace()}>
          Send
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
    padding: 16,
  },
  switch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
