import { FlatList, Image, View } from "react-native";
import { Card, Icon, Text, TouchableRipple } from "react-native-paper";
import { GoogleAutocompletePlace } from "../types/google-autocomplete-search";
import { GooglePlaceDetails } from "../types/google-place-details";
import { googleMapsClient } from "../clients/google-maps";

type QueryPlaceResultsProps = {
  googleAutoCompletePlaces: Array<GoogleAutocompletePlace>;
  onPlaceSelected: (place: GoogleAutocompletePlace) => void;
};

export const QueryPlaceResults = ({
  onPlaceSelected,
  googleAutoCompletePlaces: placesFromAutocompleteGoogle,
}: QueryPlaceResultsProps) => {
  return (
    <FlatList
      contentContainerStyle={{ gap: 8, marginHorizontal: 16 }}
      style={{ borderRadius: 16 }}
      data={placesFromAutocompleteGoogle}
      renderItem={({ item: place }) => (
        <Card
          style={{ shadowOpacity: 0 }}
          key={place.place_id}
          onPress={() => onPlaceSelected(place)}
        >
          <Card.Content>
            <Text variant="titleMedium">{place.description}</Text>
          </Card.Content>
        </Card>
      )}
      keyExtractor={(item) => item.place_id}
    />
  );
};
