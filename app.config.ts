import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): Partial<ExpoConfig> => ({
  ...config,
  ios: {
    config: {
      googleMapsApiKey: process.env.GCP_MAPS_API_KEY,
    },
    bundleIdentifier: "com.thundersats.app",
    googleServicesFile: "./config/GoogleService-Info.plist",
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.GCP_MAPS_API_KEY,
      },
    },
    package: "com.thundersats.app",
    googleServicesFile: "./config/google-services.json",
  },
});
