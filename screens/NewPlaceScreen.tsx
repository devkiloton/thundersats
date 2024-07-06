import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Icon,
  Searchbar,
  Switch,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { categories } from "../constants/categories";
import {
  GoogleAutocompletePlace,
  GoogleAutocompleteSearch,
} from "../types/google-autocomplete-Search";
import { FlatList } from "react-native-gesture-handler";
import { useLocales } from "expo-localization";
import { GooglePlaceDetails } from "../types/google-place-details";

export const NewPlaceScreen = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [isBitcoinAccepted, setIsBitcoinAccepted] = useState(false);
  const [isLightingAccepted, setIsLightingAccepted] = useState(false);
  const [isCryptoAccepted, setIsCryptoAccepted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [googleAutocompletePlaces, setGoogleAutocompletePlaces] = useState<
    GoogleAutocompletePlace[]
  >([]);
  const [selectedPlace, setSelectedPlace] =
    useState<GoogleAutocompletePlace | null>(null);
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<GooglePlaceDetails | null>(null);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const locale = useLocales()[0];

  const onToggleBitcoin = () => setIsBitcoinAccepted(!isBitcoinAccepted);
  const onToggleLighting = () => setIsLightingAccepted(!isLightingAccepted);
  const onToggleCrypto = () => setIsCryptoAccepted(!isCryptoAccepted);

  const onSearchChange = async (data: string) => {
    const searchResult = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&language=${locale.languageTag.replace(
        "-",
        "_"
      )}&types=establishment&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
    );
    searchResult
      .json()
      .then((search: GoogleAutocompleteSearch) =>
        setGoogleAutocompletePlaces(search.predictions)
      );
  };

  const getPlaceDetails = async (placeId: string) => {
    const placeDetails = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo,formatted_phone_number,formatted_address,opening_hours,user_ratings_total,website,reviews&locationbias=ipbias&language=${locale.languageTag.replace(
        "-",
        "_"
      )}&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
    );
    placeDetails.json().then((place) => setSelectedPlaceDetails(place));
  };

  const onConfirmPlace = (isCorrect: boolean) => {
    if (isCorrect) {
      setIsPlaceSelected(true);
      setGoogleAutocompletePlaces([]);
    } else {
      setSelectedPlace(null);
      setSelectedPlaceDetails(null);
      setGoogleAutocompletePlaces([]);
      setSearch("");
    }
  };

  useEffect(() => {
    onSearchChange(search);
  }, [search]);

  useEffect(() => {
    if (selectedPlace === null) return;
    getPlaceDetails(selectedPlace?.place_id);
  }, [selectedPlace]);

  const QueryLayout = () => {
    if (selectedPlace === null) {
      return (
        <FlatList
          contentContainerStyle={{ gap: 8 }}
          style={{ borderRadius: 16 }}
          data={googleAutocompletePlaces}
          renderItem={({ item: place }) => (
            <TouchableRipple
              key={place.place_id}
              onPress={() => setSelectedPlace(place)}
              style={{ borderRadius: 32 }}
            >
              <Card mode="contained">
                <Card.Content>
                  <Text variant="titleMedium">{place.description}</Text>
                </Card.Content>
              </Card>
            </TouchableRipple>
          )}
          keyExtractor={(item) => item.place_id}
        />
      );
    } else {
      return (
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
          <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
            Gallery
          </Text>
          <FlatList
            data={selectedPlaceDetails?.result.photos}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ borderRadius: 16, height: 300 }}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Card.Cover
                key={item.photo_reference}
                style={{ aspectRatio: 1.5 }}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`,
                }}
              />
            )}
          />
          <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
            Reviews
          </Text>
          <FlatList
            data={selectedPlaceDetails?.result.reviews}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Card key={item.author_url} mode="contained">
                <Card.Content>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <Image
                      src={item.profile_photo_url}
                      style={{ width: 50, height: 50 }}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <View>
                        <Text variant="titleMedium">{item.author_name}</Text>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          {Array.from({ length: item.rating }, () => (
                            <Icon size={16} source={"star"} color="orange" />
                          ))}
                        </View>
                      </View>
                      <Text variant="labelMedium">
                        {item.relative_time_description}
                      </Text>
                    </View>
                  </View>
                  <Text>{item.text}</Text>
                </Card.Content>
              </Card>
            )}
          />
        </>
      );
    }
  };

  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      {selectedPlace === null || selectedPlaceDetails === null ? (
        <Searchbar
          placeholder="Find the place..."
          onChangeText={setSearch}
          value={search}
        />
      ) : (
        <>
          {isPlaceSelected && (
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
        <QueryLayout />
      ) : (
        <>
          <View style={styles.switch}>
            <Text>Do they accept Bitcoin?</Text>
            <Switch value={isBitcoinAccepted} onValueChange={onToggleBitcoin} />
          </View>
          <View style={styles.switch}>
            <Text>Do they accept Bitcoin Lighting?</Text>
            <Switch
              value={isLightingAccepted}
              onValueChange={onToggleLighting}
            />
          </View>
          <View style={styles.switch}>
            <Text>Do they accept other cryptos?</Text>
            <Switch value={isCryptoAccepted} onValueChange={onToggleCrypto} />
          </View>
          <Text>Choose some category</Text>
          <CategoryCarousel
            categories={categories}
            activeCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          <Button
            icon="send"
            mode="contained"
            onPress={() => console.log("Pressed")}
          >
            Send
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  switch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
