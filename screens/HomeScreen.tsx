import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Chip, FAB, useTheme } from "react-native-paper";
import { Text } from "react-native-paper";
import { categories } from "../constants/categories";

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <View style={styles.header}>
        <FAB
          customSize={96}
          icon="map"
          mode="flat"
          size="large"
          label="All places"
          style={{ width: "100%" }}
          onPress={() => navigation.navigate("Map")}
        />
      </View>
      <View style={styles.secondaryHeader}>
        <FAB
          customSize={96}
          icon="heart"
          mode="flat"
          size="large"
          label="Favorites"
          style={{ flex: 1 }}
          onPress={() => console.log("Pressed")}
        />
        <FAB
          customSize={96}
          icon="plus"
          mode="flat"
          size="large"
          label="Add place"
          style={{ flex: 1 }}
          onPress={() => console.log("Pressed")}
        />
      </View>
      <Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
        Categories
      </Text>
      <FlatList
        style={{ maxHeight: 32 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalFlatlist}
        renderItem={(data) => {
          return (
            <Chip
              showSelectedOverlay={true}
              showSelectedCheck
              icon="information"
              onPress={() => console.log("Pressed")}
            >
              {data.item}
            </Chip>
          );
        }}
        horizontal
        data={categories}
        keyExtractor={(item) => item}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 16,
  },
  secondaryHeader: {
    flexDirection: "row",
    gap: 16,
  },
  horizontalFlatlist: {
    flexDirection: "row",
    gap: 16,
  },
});
