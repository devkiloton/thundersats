import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Appbar, List, MD3Colors } from "react-native-paper";
import { firebaseClient, Notification } from "../clients/firebase";
import { observer } from "mobx-react-lite";
import { useNotificationsStore } from "../stores/NotificationsStore";

export const NotificationsScreen = observer(() => {
  const navigation = useNavigation();
  const notificationsStore = useNotificationsStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dateLastNotificationSeen, setDateLastNotificationSeen] = useState<
    number | null
  >(null);

  useEffect(() => {
    const { allNotifications, dateLastNotificationSeen } =
      notificationsStore.notifications;
    setNotifications(allNotifications);
    setDateLastNotificationSeen(dateLastNotificationSeen);
    return () => {
      notificationsStore.setLastNotificationSeen().then((timestamp) => {
        setDateLastNotificationSeen(timestamp.seconds);
      });
    };
  }, [notificationsStore.notifications]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Appbar.Header mode="small" elevated>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title={"Notifications"} />
      </Appbar.Header>
      <FlatList
        data={notifications}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: MD3Colors.neutral90 }} />
        )}
        renderItem={({ item }) => (
          <List.Item
            style={{
              backgroundColor:
                dateLastNotificationSeen &&
                item.createdAt.seconds > dateLastNotificationSeen
                  ? MD3Colors.neutral95
                  : undefined,
            }}
            titleStyle={{
              fontWeight:
                dateLastNotificationSeen &&
                item.createdAt.seconds > dateLastNotificationSeen
                  ? "bold"
                  : "normal",
            }}
            title={item.subject}
            description={item.message}
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.createdAt.seconds.toString()}
      />
    </View>
  );
});
