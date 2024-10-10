import { useEffect, useState } from "react";
import { firebaseClient, Place } from "../clients/firebase";
import { FlatList, Image, View } from "react-native";
import { Card, Text, Icon } from "react-native-paper";
import { TouchableHighlight } from "react-native-gesture-handler";
import { CategoriesEnum } from "../constants/categories";

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

  const updatePlaces = () => {
    firebaseClient()
      .places.query({
        limit: paginationLimit.base,
        page: paginationLimit.increment,
        category,
      })
      .then((placesFirebase) => {
        if (placesFirebase === null) return;

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
      contentContainerStyle={{ gap: 8 }}
      ListHeaderComponent={children}
      style={{ borderRadius: 16 }}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.25}
      data={places}
      onEndReached={updatePlaces}
      renderItem={({ item: place }) => (
        <TouchableHighlight
          key={place.id}
          onPress={() => {}}
          style={{
            borderRadius: 12,
            backgroundColor: "white",
            marginHorizontal: 16,
          }}
        >
          <Card mode="contained">
            <Card.Content
              style={{
                gap: 2,
              }}
            >
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                variant="titleMedium"
              >
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
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  {place.hasBitcoin && (
                    <Image
                      style={{ width: 16, height: 16 }}
                      source={require("../assets/btc-logo.png")}
                    />
                  )}
                  {place.hasLighting && (
                    <Image
                      style={{ width: 16, height: 16 }}
                      source={require("../assets/ln-logo.png")}
                    />
                  )}
                  {place.hasCryptos && (
                    <Image
                      style={{ width: 11, height: 16 }}
                      source={require("../assets/eth-logo.png")}
                    />
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        </TouchableHighlight>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};
