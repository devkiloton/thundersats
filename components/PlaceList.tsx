import { useEffect, useState } from "react";
import { firebaseClient, Place } from "../clients/firebase";
import { FlatList, View } from "react-native";
import { Card, Text, Icon } from "react-native-paper";
import { CategoriesEnum } from "../constants/categories";
import { AcceptedCoins } from "./AcceptedCoins";
import { googleMapsClient } from "../clients/google-maps";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type PlaceListProps = {
  children: React.ComponentType<any> | React.ReactElement | null;
  category: CategoriesEnum | null;
};

export const PlaceList = ({ children, category }: PlaceListProps) => {
  const [places, setPlaces] = useState<(Place & { id: string })[]>([]);
  const [paginationLimit, setPaginationLimit] = useState({
    base: 8,
    increment: 1,
  });
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const updatePlaces = () => {
    firebaseClient()
      .places.query({
        limit: paginationLimit.base,
        page: paginationLimit.increment,
        category,
      })
      .then((placesFirebase) => {
        if (placesFirebase == null) return;

        const placesWithId = Object.entries(placesFirebase)
          .filter(([key]) => !places.find((place) => place.id === key))
          .map(([id, place]) => ({ ...place, id }));
        setPlaces([...places, ...placesWithId]);
      });

    setPaginationLimit({
      base: paginationLimit.base,
      increment: paginationLimit.increment + 1,
    });
  };

  useEffect(() => {
    setPlaces([]);
    setPaginationLimit({
      base: 8,
      increment: 1,
    });
    updatePlaces();
  }, [category]);

  return (
    <FlatList
      contentContainerStyle={{
        gap: 12,
        paddingBottom: 150,
        paddingHorizontal: 16,
      }}
      ListHeaderComponent={children}
      style={{ borderRadius: 16 }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.25}
      data={places}
      onEndReached={updatePlaces}
      renderItem={({ item: place }) => (
        <Card
          contentStyle={{
            display: "flex",
            flexDirection: "column",
          }}
          onPress={() => navigation.navigate("Place Home", { place })}
          style={{ shadowOpacity: 0 }}
        >
          <Card.Cover
            source={{
              uri: googleMapsClient.urls.photos({
                photoReference: place.coverPhotoReference,
                maxWidth: 400,
              }),
            }}
            style={{ height: 150 }}
          />
          <Card.Content
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              paddingVertical: 8,
              gap: 4,
            }}
          >
            <Text ellipsizeMode="tail" numberOfLines={1} variant="titleMedium">
              {place.name}
            </Text>
            <Text ellipsizeMode="tail" numberOfLines={1} variant="bodySmall">
              {place.address}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Icon size={16} source={"star"} color="orange" />
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  variant="bodySmall"
                >
                  {place.rating}
                </Text>
              </View>
              <AcceptedCoins place={place} />
            </View>
          </Card.Content>
        </Card>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
