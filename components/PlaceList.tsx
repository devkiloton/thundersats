import { useEffect, useState } from "react";
import { firebaseClient, Place } from "../clients/firebase";
import { FlatList } from "react-native";
import { Card, Text, TouchableRipple } from "react-native-paper";

export const PlaceList = () => {
  const [page, setPage] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[] | null>([]);
  useEffect(() => {
    firebaseClient()
      .places.query({
        limit: 30,
        start: page,
      })
      .then((placesFirebase) => {
        setPlaces(Object.values(placesFirebase ?? {}));
      });
  }, []);
  return (
    <FlatList
      contentContainerStyle={{ gap: 8 }}
      style={{ borderRadius: 16 }}
      data={places}
      renderItem={({ item: place }) => (
        <TouchableRipple
          key={place.locationIdGoogle}
          onPress={() => {}}
          style={{ borderRadius: 32 }}
        >
          <Card mode="contained">
            <Card.Content>
              <Text variant="titleMedium">{place.name}</Text>
            </Card.Content>
          </Card>
        </TouchableRipple>
      )}
      keyExtractor={(item) => item.locationIdGoogle}
    />
  );
};
