import { makeObservable, observable, runInAction } from "mobx";
import { firebaseClient, Notification } from "../../clients/firebase";
import { Timestamp } from "firebase/firestore";

export class NotificationsStore {
  @observable notifications: {
    allNotifications: Notification[];
    dateLastNotificationSeen: number | null;
    loading: boolean;
    loaded: boolean;
  } = {
    allNotifications: [],
    dateLastNotificationSeen: null,
    loading: false,
    loaded: false,
  };

  constructor() {
    makeObservable(this);
  }

  async setLastNotificationSeen() {
    const now = Timestamp.now();
    firebaseClient()
      .notifications.updateMetadata({
        dateLastNotificationSeen: now,
      })
      .then(() => {
        runInAction(() => {
          this.notifications.dateLastNotificationSeen = now.seconds;
        });
      });
    return now;
  }

  async get(forceUpdate: boolean = false) {
    if (this.notifications.loaded && !forceUpdate) {
      return this.notifications.allNotifications;
    }
    runInAction(() => {
      this.notifications.loading = true;
    });

    firebaseClient()
      .notifications.aggregateNotifications()
      .then((notifications) => {
        if (!notifications) {
          return;
        }

        const {
          dateLastNotificationSeen,
          globalNotifications,
          privateNotifications,
        } = notifications;

        const orderedNotifications = [
          ...globalNotifications,
          ...privateNotifications,
        ].sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

        runInAction(() => {
          this.notifications.allNotifications = orderedNotifications;
          this.notifications.dateLastNotificationSeen =
            dateLastNotificationSeen.seconds;
          this.notifications.loaded = true;
          this.notifications.loading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.notifications.loading = false;
        });
      });

    return this.notifications;
  }
}
