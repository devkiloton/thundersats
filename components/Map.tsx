import React, { useCallback, useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Animated, Dimensions, Platform, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { firebaseClient, Place } from "../clients/firebase";
import { Card, IconButton } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AcceptedCoins } from "./AcceptedCoins";
import { observer } from "mobx-react-lite";
import { useFavoriteStore } from "../stores/FavoritesStore";
import { mapsStyle } from "../constants/maps-style";

const { width } = Dimensions.get("screen");
const CARD_WIDTH = width - 64;
const MARGIN_HORIZONTAL = 8;
const SNAP_TO_INTERVAL = CARD_WIDTH + MARGIN_HORIZONTAL * 2;
const CONTENT_INSET = 64 / 2 - MARGIN_HORIZONTAL;
import * as Linking from "expo-linking";
const LATITUDE_DELTA = 0.006;
const LONGITUDE_DELTA = 0.006;

export const Map = observer(() => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [boundaries, setBoundaries] = useState<number[] | null>(null);
  const [places, setPlaces] = useState<(Place & { id: string })[]>([]);
  const mapRef = React.useRef<MapView>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const mapAnimation = new Animated.Value(0);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const favoritesStore = useFavoriteStore();
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (status?.granted) {
      Location.getCurrentPositionAsync().then((location) => {
        setLocation(location);
      });
    } else {
      requestPermission();
    }
  }, [status]);

  const queryPlaces = useCallback(
    (bbox: number[]) => {
      // TODO: Adjust query algorithm here
      firebaseClient()
        .places.query({
          limit: 30,
          page: 1,
          bbox,
        })
        .then((placesFirebase) => {
          const orderedNearToMyLocation = Object.entries(placesFirebase ?? {})
            .map(([key, value]) => ({ ...value, id: key }))
            .sort((a) => a.location.lat - (location?.coords.latitude ?? 0));
          setPlaces(orderedNearToMyLocation);
        });
    },
    [setPlaces, location]
  );

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / SNAP_TO_INTERVAL + 0.3);
      if (index >= places.length) {
        index = places.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }
    });
  }, [places]);

  const onMarkerPress = useCallback(
    (index: number) => {
      const place = places[index];

      scrollViewRef.current?.scrollTo({
        x: index * SNAP_TO_INTERVAL - CONTENT_INSET,
        animated: true,
      });
    },
    [places, mapRef, scrollViewRef]
  );

  // Function to check if the new bounding box is outside the current one
  const isOutsideCurrentBoundaries = (newBBox: Array<number>) => {
    if (!boundaries) return true; // If there are no current boundaries, update state

    const [newWest, newSouth, newEast, newNorth] = newBBox;
    const [currWest, currSouth, currEast, currNorth] = boundaries;

    // Check if the new bounding box extends outside of the current one
    return (
      newWest < currWest || // New west bound is further west
      newEast > currEast || // New east bound is further east
      newSouth < currSouth || // New south bound is further south
      newNorth > currNorth // New north bound is further north
    );
  };

  const interpolations = places.map((_, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.6, 1],
      extrapolate: "clamp",
    });
    return { scale };
  });

  return (
    <>
      <MapView
        liteMode
        googleMapId={process.env.EXPO_PUBLIC_GOOGLE_MAP_ID}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        customMapStyle={mapsStyle}
        onTouchStart={() => setIsTracking(true)}
        onTouchEnd={() => setIsTracking(false)}
        onRegionChangeComplete={() => {
          mapRef.current?.getMapBoundaries().then((boundingBox) => {
            const newBBox = [
              boundingBox?.southWest.longitude,
              boundingBox?.southWest.latitude,
              boundingBox?.northEast.longitude,
              boundingBox?.northEast.latitude,
            ];

            // Check if new bounding box is outside current boundaries
            if (isOutsideCurrentBoundaries(newBBox)) {
              setBoundaries(newBBox);
              queryPlaces(newBBox);
            }
          });
        }}
        // customMapStyle={}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        showsIndoors={false}
        showsCompass={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsUserLocation
        region={{
          latitude: location?.coords.latitude ?? 0,
          longitude: location?.coords.longitude ?? 0,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {places.map((place, index) => {
          const scaleStyle = {
            height: 30,
            width: 30,
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          return (
            <Marker
              key={place.locationIdGoogle}
              onPress={() => onMarkerPress(index)}
              coordinate={{
                latitude: place.location.lat,
                longitude: place.location.lng,
              }}
              tracksViewChanges={Platform.OS === "android" ? isTracking : true}
            >
              <Animated.Image
                source={require("../assets/marker.png")}
                resizeMode={"cover"}
                style={{ ...scaleStyle }}
              />
            </Marker>
          );
        })}
      </MapView>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={SNAP_TO_INTERVAL}
        decelerationRate={"fast"}
        snapToAlignment={"center"}
        style={styles.scrollView}
        contentInset={{
          left: CONTENT_INSET,
          right: CONTENT_INSET,
        }}
        onMomentumScrollBegin={() => setIsTracking(true)}
        onMomentumScrollEnd={() => setIsTracking(false)}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: false }
        )}
      >
        {places.map((place, index) => {
          const isFavorite = favoritesStore.favorites.places.find(
            (favoritePlace) =>
              favoritePlace.locationIdGoogle === place.locationIdGoogle
          );
          const bookMarkIcon = isFavorite ? "bookmark" : "bookmark-outline";
          return (
            <Card
              key={place.locationIdGoogle}
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lng}`
                )
              }
              style={{
                width: CARD_WIDTH,
                marginHorizontal: MARGIN_HORIZONTAL,
                marginBottom: 8,
              }}
            >
              <Card.Title
                titleNumberOfLines={1}
                title={place.name}
                subtitle={place.address}
              />
              <Card.Content>
                <AcceptedCoins place={place} />
                <IconButton
                  icon={bookMarkIcon}
                  style={{ position: "absolute", right: 0, bottom: -2 }}
                  size={20}
                  onPress={() =>
                    isFavorite
                      ? favoritesStore.delete(place)
                      : favoritesStore.create(place)
                  }
                />
              </Card.Content>
            </Card>
          );
        })}
      </Animated.ScrollView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    position: "absolute",
    bottom: 16,
    width: "100%",
  },
});
