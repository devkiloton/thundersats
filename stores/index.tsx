import { PropsWithChildren } from "react";
import { FavoritesStoreProvider } from "./FavoritesStore";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  return <FavoritesStoreProvider>{children}</FavoritesStoreProvider>;
};
