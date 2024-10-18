import {
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  where,
  query,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { CategoriesEnum } from "../constants/categories";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../hooks/firebase";

export const firebaseClient = () => {
  return {
    favorites: {
      create: async (place: Place) => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) return;

        const firestore = getFirestore();
        const docRef = doc(firestore, "favorites", uid);
        await setDoc(
          docRef,
          { [place.locationIdGoogle]: place },
          { merge: true }
        );
      },
      delete: async (place: Place) => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) return;

        // Write in the firestore
        const firestore = getFirestore();
        const docRef = doc(firestore, "favorites", uid);
        await setDoc(
          docRef,
          { [place.locationIdGoogle]: null },
          { merge: true }
        );
      },
      get: async (): Promise<Record<string, Place>> => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) return {};

        const firestore = getFirestore();
        const docRef = doc(firestore, "favorites", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.data() as Record<string, Place>;
      },
    },
    notifications: {
      updateMetadata: async (metadata: {
        dateLastNotificationSeen: Timestamp;
      }) => {
        const uid = getAuth().currentUser?.uid;
        if (!uid) return;

        const firestore = getFirestore();
        const docRef = doc(firestore, "private_notification", uid);
        await setDoc(docRef, metadata, { merge: true });
      },
      aggregateNotifications: async (): Promise<
        AggregatedNotifications | undefined
      > => {
        const firestore = getFirestore();

        const uid = getAuth().currentUser?.uid;
        if (!uid) return;

        const globalNotifications = getDocs(
          collection(firestore, "global_notification")
        );
        const private_notifications = getDocs(
          collection(firestore, "private_notification", uid, "notification")
        );
        const dateLastNotificationSeen = getDoc(
          doc(firestore, "private_notification", uid)
        ).then((doc) => doc.data()?.dateLastNotificationSeen);

        const allNotifications = await Promise.all([
          globalNotifications,
          private_notifications,
          dateLastNotificationSeen,
        ]);

        return {
          globalNotifications: allNotifications[0].docs.map(
            (doc) => doc.data() as Notification
          ),
          privateNotifications: allNotifications[1].docs.map(
            (doc) => doc.data() as Notification
          ),
          dateLastNotificationSeen: allNotifications[2],
        };
      },
    },
    codes: {
      send: async (email: string) => {
        const functions = getFunctions(app(), "europe-west3");
        const sendCode = httpsCallable<unknown, { docId: string }>(
          functions,
          "sendCode"
        );
        return await sendCode({
          email,
        });
      },
      confirm: async ({ code, codeId }: { code: string; codeId: string }) => {
        const functions = getFunctions(app(), "europe-west3");
        const confirmCode = httpsCallable(functions, "confirmCode");
        return confirmCode({
          code,
          codeId,
        }).then((result) => result.data as boolean);
      },
    },
    places: {
      create: async (place: Place) => {
        // Write in the firestore
        const firestore = getFirestore();
        const docRef = doc(firestore, "places", place.locationIdGoogle);
        await setDoc(docRef, place);
      },
      /**
       * The start can be a number or uid
       */
      query: async ({
        limit,
        page,
        category = null,
        bbox = null,
      }: {
        limit: number;
        page: number;
        category?: CategoriesEnum | null;
        bbox?: number[] | null;
      }) => {
        const queryConstraint = _getQueryConstraints({
          category,
          bbox,
          limitResults: limit,
          page,
        });

        const querySnapshot = await getDocs(queryConstraint);
        const querySnapshotEntries = querySnapshot.docs
          .filter((v) => v.data().isVerified)
          .map((doc) => [doc.data().locationIdGoogle, doc.data()]);

        return Object.fromEntries(querySnapshotEntries) as Record<
          string,
          Place
        >;
      },
    },
  };
};

const _getQueryConstraints = ({
  category,
  bbox,
  limitResults,
  page,
}: {
  category: CategoriesEnum | null;
  bbox: number[] | null;
  limitResults?: number;
  page?: number;
}) => {
  const firestore = getFirestore();

  if (category && limitResults && page) {
    return query(
      collection(firestore, "places"),
      where("category", "==", category),
      where("isVerified", "==", true),
      limit(limitResults * page)
    );
  }

  if (bbox)
    return query(
      collection(firestore, "places"),
      where("location.lat", ">=", bbox[1]),
      where("location.lat", "<=", bbox[3]),
      where("location.lng", ">=", bbox[0]),
      where("location.lng", "<=", bbox[2])
    );

  if (!limitResults || !page)
    return query(collection(firestore, "places"), where("isVerified", ">", 0));

  return query(
    collection(firestore, "places"),
    where("isVerified", "==", true),
    limit(limitResults * page)
  );
};

export interface Place {
  hasBitcoin: boolean;
  hasLighting: boolean;
  hasCryptos: boolean;
  category: string;
  name: string;
  address: string;
  location: Location;
  locationIdGoogle: string;
  ratingGoogle: number | undefined | null;
  phone: string | undefined | null;
  website: string | undefined | null;
  rating: number | undefined | null;
  priceLevel: number | undefined | null;
  wheelchairAccessibleEntrance: boolean | undefined | null;
  coverPhotoReference: string | undefined | null;
  isVerified: boolean;
  submittedBy: string;
  views: number;
  createdAt: number;
}

interface Location {
  lat: number;
  lng: number;
}

type AggregatedNotifications = {
  globalNotifications: Notification[];
  privateNotifications: Notification[];
  dateLastNotificationSeen: FirebaseTimestamp;
};

export type Notification = {
  createdAt: FirebaseTimestamp;
  subject: string;
  isInteractive: boolean;
  message: string;
};

type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};
