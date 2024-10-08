import { Persistence, ReactNativeAsyncStorage } from "firebase/auth";

// https://stackoverflow.com/questions/76914913/cannot-import-getreactnativepersistence-in-firebase10-1-0
declare module "firebase/auth" {
  export function getReactNativePersistence(
    storage: ReactNativeAsyncStorage
  ): Persistence;
}
