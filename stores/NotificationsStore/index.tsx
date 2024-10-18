import { createContext, PropsWithChildren, useContext } from "react";
import { NotificationsStore } from "./NotificationsStore";

const NotificationsStoreContext = createContext(new NotificationsStore());

export const useNotificationsStore = () =>
  useContext<NotificationsStore>(NotificationsStoreContext);

export const NotificationsStoreProvider = (props: PropsWithChildren) => (
  <NotificationsStoreContext.Provider
    {...props}
    value={new NotificationsStore()}
  />
);
