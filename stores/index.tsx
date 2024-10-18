import { PropsWithChildren } from "react";
import { FavoritesStoreProvider } from "./FavoritesStore";
import { NotificationsStoreProvider } from "./NotificationsStore";

export const StoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <FavoritesStoreProvider>
      <NotificationsStoreProvider>{children}</NotificationsStoreProvider>
    </FavoritesStoreProvider>
  );
};
