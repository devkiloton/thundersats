import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Searchbar, useTheme } from "react-native-paper";
import { useLocales } from "expo-localization";
import { googleMapsClient } from "../clients/google-maps";
import {
  GoogleAutocompletePlace,
  GoogleAutocompleteSearch,
} from "../types/google-autocomplete-search";
import { QueryPlaceResults } from "../components/QueryPlaceResults";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

export const NewPlaceScreen = () => {
  const theme = useTheme();
  const locale = useLocales()[0];
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [search, setSearch] = useState("");

  const [googleAutocompletePlaces, setGoogleAutocompletePlaces] = useState<
    GoogleAutocompletePlace[]
  >([]);

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
      <View
        style={{
          ...styles.container,
        }}
      >
        <Searchbar
          style={{ marginHorizontal: 16, marginTop: 16 }}
          placeholder="Find the place..."
          onChangeText={setSearch}
          value={search}
        />

        {googleAutocompletePlaces.length > 0 && (
          <QueryPlaceResults
            googleAutoCompletePlaces={googleAutocompletePlaces}
            onPlaceSelected={(placeFromAutoComplete) =>
              navigation.navigate("Google Place", {
                placeFromAutoComplete,
              })
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
  },
});
