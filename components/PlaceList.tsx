import { Place } from "../clients/firebase";
import { FlatList, View } from "react-native";
import { Card, Text, Icon, IconButton } from "react-native-paper";
import { AcceptedCoins } from "./AcceptedCoins";
import { googleMapsClient } from "../clients/google-maps";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFavoriteStore } from "../stores/FavoritesStore";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

type PlaceListProps = {
  children?: React.ComponentType<any> | React.ReactElement | null;
  onEndReached?: () => void;
  places: (Place & { id: string })[];
};

export const PlaceList = observer(
  ({ children, places, onEndReached }: PlaceListProps) => {
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    const favoritesStore = useFavoriteStore();

    useEffect(() => {
      favoritesStore.get();
    }, []);

    const Rendered = observer(
      ({ place }: { place: Place & { id: string } }) => {
        const isFavorite = favoritesStore.favorites.ids.includes(place.id);
        const bookMarkIcon = isFavorite ? "bookmark" : "bookmark-outline";
        return (
          <Card
            key={place.id}
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
                <AcceptedCoins place={place} />
              </View>
              <IconButton
                icon={bookMarkIcon}
                style={{ position: "absolute", right: 0, bottom: -2 }}
                size={20}
                onPress={() =>
                  isFavorite
                    ? favoritesStore.delete(place.id)
                    : favoritesStore.create(place.id)
                }
              />
            </Card.Content>
          </Card>
        );
      }
    );

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
        onEndReached={onEndReached}
        renderItem={({ item }) => <Rendered place={item} />}
        keyExtractor={(item) => item.id}
      />
    );
  }
);
