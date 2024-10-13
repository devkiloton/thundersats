import { createContext, PropsWithChildren, useContext } from "react";
import { FavoritesStore } from "./FavoritesStore";

const FavoritesStoreContext = createContext(new FavoritesStore());

export const useFavoriteStore = () =>
  useContext<FavoritesStore>(FavoritesStoreContext);

export const FavoritesStoreProvider = (props: PropsWithChildren) => (
  <FavoritesStoreContext.Provider {...props} value={new FavoritesStore()} />
);
