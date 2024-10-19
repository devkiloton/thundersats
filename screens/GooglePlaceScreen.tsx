import {
  ParamListBase,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Appbar, Card, Icon, Text } from "react-native-paper";
import { googleMapsClient } from "../clients/google-maps";
import { GooglePlaceDetails } from "../types/google-place-details";
import { useEffect, useState } from "react";
import { useLocales } from "expo-localization";
import { GoogleAutocompletePlace } from "../types/google-autocomplete-search";
import { StackNavigationProp } from "@react-navigation/stack";

export function GooglePlaceScreen() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const locale = useLocales()[0];
  const { params } = useRoute();
  const { placeFromAutoComplete } = params as {
    placeFromAutoComplete: GoogleAutocompletePlace;
  };

  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<GooglePlaceDetails | null>(null);

  const getPlaceDetails = async (placeId: string) => {
    const placeDetails = await googleMapsClient.places.details({
      placeId,
      locale: locale.languageTag.replace("-", "_"),
    });
    placeDetails
      .json()
      .then((place: GooglePlaceDetails) => setSelectedPlaceDetails(place));
  };

  useEffect(() => {
    getPlaceDetails(placeFromAutoComplete.place_id);
  }, []);

  const hasContacts = () => {
    return (
      selectedPlaceDetails?.result.international_phone_number ||
      selectedPlaceDetails?.result.website
    );
  };

  const hasPhotos = () => {
    return selectedPlaceDetails?.result.photos?.length;
  };

  const hasComments = () => {
    return selectedPlaceDetails?.result.reviews?.length;
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Place" />
        <Appbar.Action
          icon={"check"}
          onPress={() =>
            navigation.navigate("Confirm Place", {
              ...selectedPlaceDetails,
              place_id: placeFromAutoComplete.place_id,
            })
          }
        />
      </Appbar.Header>
      {selectedPlaceDetails && (
        <FlatList
          data={selectedPlaceDetails?.result.reviews}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, padding: 16 }}
          scrollEnabled
          ListHeaderComponent={() => (
            <View style={{ flex: 1, gap: 8 }}>
              <Text variant="titleLarge">
                {selectedPlaceDetails.result.name}
              </Text>
              <Text>{selectedPlaceDetails?.result.formatted_address}</Text>
              {hasPhotos() && (
                <FlatList
                  data={selectedPlaceDetails?.result?.photos}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ borderRadius: 16 }}
                  contentContainerStyle={{ gap: 8 }}
                  renderItem={({ item }) => (
                    <Card.Cover
                      key={item.photo_reference}
                      style={{ aspectRatio: 1.5 }}
                      source={{
                        uri: googleMapsClient.urls.photos({
                          photoReference: item.photo_reference,
                          maxWidth: 400,
                        }),
                      }}
                    />
                  )}
                />
              )}
              {hasComments() && <Text variant="titleLarge">Comments</Text>}
            </View>
          )}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
});
