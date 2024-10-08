import { useEffect, useState } from "react";
import { firebaseClient, Place } from "../clients/firebase";
import { FlatList, TouchableOpacity } from "react-native";
import { Card, Text, TouchableRipple, MD3LightTheme } from "react-native-paper";
import { TouchableHighlight } from "react-native-gesture-handler";

export const PlaceList = () => {
  const [places, setPlaces] = useState<Place[] | null>([]);
  useEffect(() => {
    firebaseClient()
      .places.query({
        limit: 30,
        start: null,
      })
      .then((placesFirebase) => {
        setPlaces(Object.values(placesFirebase ?? {}));
      });
  }, []);
  return (
    <FlatList
      contentContainerStyle={{ gap: 8 }}
      style={{ borderRadius: 16 }}
      scrollEnabled={false}
      data={places}
      renderItem={({ item: place }) => (
        <TouchableHighlight
          key={place.locationIdGoogle}
          onPress={() => {}}
          style={{
            borderRadius: 12,
            backgroundColor: "white",
          }}
        >
          <Card mode="contained">
            <Card.Content>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                variant="titleMedium"
              >
                {place.name}
              </Text>
            </Card.Content>
          </Card>
        </TouchableHighlight>
      )}
      keyExtractor={(item) => item.locationIdGoogle}
    />
  );
};
