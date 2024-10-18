import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Searchbar,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { categories, CategoriesEnum } from "../constants/categories";
import { useLocales } from "expo-localization";
import { GooglePlaceDetails } from "../types/google-place-details";
import { googleMapsClient } from "../clients/google-maps";
import { firebaseClient } from "../clients/firebase";
import {
  GoogleAutocompletePlace,
  GoogleAutocompleteSearch,
} from "../types/google-autocomplete-search";
import { QueryPlaceResults } from "../components/QueryPlaceResults";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { getAuth } from "firebase/auth";

export const NewPlaceScreen = () => {
  const theme = useTheme();
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [search, setSearch] = useState("");
  const [hasBitcoin, setHasBitcoin] = useState(false);
  const [hasLighting, setHasLighting] = useState(false);
  const [hasCryptos, setHasCryptos] = useState(false);
  const [category, setCategory] = useState<CategoriesEnum | null>(null);
  const [googleAutocompletePlaces, setGoogleAutocompletePlaces] = useState<
    GoogleAutocompletePlace[]
  >([]);
  const [selectedPlace, setSelectedPlace] =
    useState<GoogleAutocompletePlace | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<GooglePlaceDetails | null>(null);
  const [isPlaceConfirmed, setIsPlaceConfirmed] = useState(false);

  useEffect(() => {
    if (status?.granted) {
      Location.getCurrentPositionAsync().then((location) => {
        setLocation(location);
      });
    } else {
      requestPermission();
    }
  }, [status]);

  useEffect(() => {
    onSearchChange(search);
  }, [search]);

  useEffect(() => {
    if (selectedPlace === null) return;
    getPlaceDetails(selectedPlace?.place_id);
  }, [selectedPlace]);
  const locale = useLocales()[0];

  const onToggleBitcoin = () => setHasBitcoin(!hasBitcoin);
  const onToggleLighting = () => setHasLighting(!hasLighting);
  const onToggleCrypto = () => setHasCryptos(!hasCryptos);

  const onSearchChange = async (data: string) => {
    const searchResult = await googleMapsClient.places.autocomplete({
      input: data,
      locale: locale.languageTag.replace("-", "_"),
      coordinates:
        location?.coords.longitude && location?.coords.latitude
          ? [location?.coords.latitude, location?.coords.longitude]
          : [],
    });
    searchResult
      .json()
      .then((search: GoogleAutocompleteSearch) =>
        setGoogleAutocompletePlaces(search.predictions)
      );
  };

  const onConfirmPlace = (isCorrect: boolean) => {
    if (isCorrect) {
      setIsPlaceConfirmed(true);
      setGoogleAutocompletePlaces([]);
    } else {
      setSelectedPlace(null);
      setSelectedPlaceDetails(null);
      setGoogleAutocompletePlaces([]);
      setSearch("");
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    const placeDetails = await googleMapsClient.places.details({
      placeId,
      locale: locale.languageTag.replace("-", "_"),
    });
    placeDetails.json().then(setSelectedPlaceDetails);
  };

  const createPlace = () => {
    if (
      category === null ||
      selectedPlaceDetails === null ||
      selectedPlace === null
    ) {
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
      locationIdGoogle: selectedPlace?.place_id,
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
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Add a new place" />
      </Appbar.Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...styles.container,
        }}
        style={{ backgroundColor: theme.colors.background }}
      >
        {selectedPlace === null || selectedPlaceDetails === null ? (
          <Searchbar
            placeholder="Find the place..."
            onChangeText={setSearch}
            value={search}
          />
        ) : (
          <>
            {isPlaceConfirmed && (
              <>
                <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
                  {selectedPlace.structured_formatting.main_text}
                </Text>
                <Text variant="labelLarge">
                  {selectedPlaceDetails.result.formatted_address}
                </Text>
              </>
            )}
          </>
        )}

        {googleAutocompletePlaces.length > 0 ? (
          <>
            {selectedPlace !== null && (
              <>
                <Text variant="titleLarge" style={{ alignSelf: "center" }}>
                  Is it the place?
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Button
                    style={{ flex: 1 }}
                    mode="outlined"
                    onPress={() => onConfirmPlace(false)}
                  >
                    No
                  </Button>
                  <Button
                    mode="contained"
                    style={{ flex: 1 }}
                    onPress={() => onConfirmPlace(true)}
                  >
                    Yes
                  </Button>
                </View>
              </>
            )}
            <QueryPlaceResults
              googleAutoCompletePlaces={googleAutocompletePlaces}
              onPlaceSelected={setSelectedPlace}
              selectedPlace={selectedPlaceDetails}
            />
          </>
        ) : (
          <>
            <View style={styles.switch}>
              <Text>Do they accept Bitcoin?</Text>
              <Switch value={hasBitcoin} onValueChange={onToggleBitcoin} />
            </View>
            <View style={styles.switch}>
              <Text>Do they accept Bitcoin Lighting?</Text>
              <Switch value={hasLighting} onValueChange={onToggleLighting} />
            </View>
            <View style={styles.switch}>
              <Text>Do they accept other cryptos?</Text>
              <Switch value={hasCryptos} onValueChange={onToggleCrypto} />
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
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    gap: 16,
  },
  switch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
