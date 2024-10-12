import { Appbar } from "react-native-paper";
import { Place } from "../clients/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";

type PlaceScreenProps = {};

export const PlaceScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { place } = params as { place: Place };

  return (
    <Appbar.Header mode="small">
      <Appbar.BackAction onPress={navigation.goBack} />
      <Appbar.Content title={place.name} />
      <Appbar.Action
        icon="bookmark-outline"
        onPress={() => console.log("Edit")}
      />
    </Appbar.Header>
  );
};
