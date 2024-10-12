import { Image, View } from "react-native";
import { Place } from "../clients/firebase";
import { Text } from "react-native-paper";

type AcceptedCoinsProps = {
  place: Place;
};

export const AcceptedCoins = ({ place }: AcceptedCoinsProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 4,
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
      {!place.hasBitcoin && !place.hasLighting && !place.hasCryptos && (
        <Text>-</Text>
      )}
    </View>
  );
};
