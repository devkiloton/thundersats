import { FlatList, Image, View } from "react-native";
import { Card, Icon, Text, TouchableRipple } from "react-native-paper";
import { GoogleAutocompletePlace } from "../types/google-autocomplete-search";
import { GooglePlaceDetails } from "../types/google-place-details";
import { googleMapsClient } from "../clients/google-maps";

type QueryPlaceResultsProps = {
  selectedPlace: GooglePlaceDetails | null;
  googleAutoCompletePlaces: Array<GoogleAutocompletePlace>;
  onPlaceSelected: (place: GoogleAutocompletePlace) => void;
};

export const QueryPlaceResults = ({
  selectedPlace,
  onPlaceSelected,
  googleAutoCompletePlaces: placesFromAutocompleteGoogle,
}: QueryPlaceResultsProps) => {
  if (selectedPlace === null) {
    return (
      <FlatList
        contentContainerStyle={{ gap: 8 }}
        style={{ borderRadius: 16 }}
        data={placesFromAutocompleteGoogle}
        renderItem={({ item: place }) => (
          <TouchableRipple
            key={place.place_id}
            onPress={() => onPlaceSelected(place)}
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
        <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
          Gallery
        </Text>
        <FlatList
          data={selectedPlace?.result?.photos}
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
        <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
          Reviews
        </Text>
        <FlatList
          data={selectedPlace?.result.reviews}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: 64 }}
          scrollEnabled={false}
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
