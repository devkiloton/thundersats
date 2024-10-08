import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase-config";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const app = () => initializeApp(firebaseConfig);

export const authInit = () =>
  initializeAuth(app(), {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
