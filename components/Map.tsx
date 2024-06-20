import React from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export const Map = () => {
  return (
    <MapView
      googleMapId={process.env.GOOGLE_MAP_ID}
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      // customMapStyle={}
      showsMyLocationButton={true}
      showsBuildings={true}
      showsPointsOfInterest={false}
      showsIndoors={false}
      showsCompass={false}
      showsIndoorLevelPicker={false}
      showsTraffic={false}
      showsUserLocation
    />
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
});
