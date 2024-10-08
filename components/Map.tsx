import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Animated, Dimensions, Platform, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { firebaseClient, Place } from "../clients/firebase";
import { Button, Card } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");
const CARD_WIDTH = width - 64;
const MARGIN_HORIZONTAL = 8;
const SNAP_TO_INTERVAL = CARD_WIDTH + MARGIN_HORIZONTAL * 2;
const CONTENT_INSET = 64 / 2 - MARGIN_HORIZONTAL;

export const Map = () => {
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const mapRef = React.useRef<MapView>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const mapAnimation = new Animated.Value(0);

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
    firebaseClient()
      .places.query({
        limit: 30,
        start: null,
      })
      .then((placesFirebase) => {
        setPlaces(Object.values(placesFirebase ?? {}));
      });
  }, []);

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / SNAP_TO_INTERVAL + 0.3);
      if (index >= places.length) {
        index = places.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      const place = places[index];
      const region = {
        latitude: place.location.lat,
        longitude: place.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      mapRef.current?.animateToRegion(region);
    });
  }, [places]);

  const onMarkerPress = (index: number) => {
    const place = places[index];
    const region = {
      latitude: place.location.lat,
      longitude: place.location.lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    mapRef.current?.animateToRegion(region);
    scrollViewRef.current?.scrollTo({
      x: index * SNAP_TO_INTERVAL - CONTENT_INSET,
      animated: true,
    });
  };

  const interpolations = places.map((_, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });
    return { scale };
  });

  return (
    <>
      <MapView
        googleMapId={process.env.EXPO_PUBLIC_GOOGLE_MAP_ID}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapRef}
        // customMapStyle={}
        showsMyLocationButton={false}
        showsBuildings={true}
        showsPointsOfInterest={false}
        showsIndoors={false}
        showsCompass={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsUserLocation
        region={{
          latitude: location?.coords.latitude ?? 0,
          longitude: location?.coords.longitude ?? 0,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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
            >
              <Animated.View
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Animated.Image
                  source={require("../assets/marker.png")}
                  resizeMode={"cover"}
                  style={scaleStyle}
                />
              </Animated.View>
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
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === "android" ? CONTENT_INSET : 0,
        }}
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
        {places.map((place) => (
          <Card
            key={place.locationIdGoogle}
            style={{
              width: CARD_WIDTH,
              marginHorizontal: MARGIN_HORIZONTAL,
            }}
          >
            <Card.Cover
              style={{ height: 150 }}
              source={{ uri: "https://picsum.photos/700" }}
            />
            <Card.Title
              titleNumberOfLines={2}
              title={place.name}
              subtitle="Card Subtitle"
            />
            {/* <Card.Content></Card.Content> */}
            <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions>
          </Card>
        ))}
      </Animated.ScrollView>
    </>
  );
};

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
    paddingVertical: 40,
  },
});
