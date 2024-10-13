import {
  endAt,
  equalTo,
  get,
  getDatabase,
  limitToFirst,
  orderByChild,
  query,
  ref,
  set,
  startAt,
} from "firebase/database";
import { CategoriesEnum } from "../constants/categories";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../hooks/firebase";

export const firebaseClient = () => {
  return {
    favorites: {
      create: async (placeId: string) => {
        const db = getDatabase();
        const uid = getAuth().currentUser?.uid;
        set(ref(db, "favorites/" + `${uid}/` + placeId), true);
      },
      delete: async (placeId: string) => {
        const db = getDatabase();
        const uid = getAuth().currentUser?.uid;
        set(ref(db, "favorites/" + `${uid}/` + placeId), null);
      },
      get: async () => {
        const functions = getFunctions(app(), "europe-west3");
        const favoritePlaces = httpsCallable(functions, "getFavoritePlaces");
        return favoritePlaces().then(
          (result) => result.data as Record<string, Place>
        );
      },
    },
    places: {
      create: async (place: Place) => {
        const db = getDatabase();
        set(ref(db, "places/" + place.locationIdGoogle), place);
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
        const db = getDatabase();
        const reference = ref(db, "places");
        const queryConstraint = _getQueryConstraints({
          category,
          bbox,
          limit,
          page,
          reference,
        });

        // TODO: Learn to paginate with Firebase realtime database
        const snapshot = await get(queryConstraint);
        snapshot.val() as Record<string, Place> | null;

        if (!snapshot.exists()) return null;

        if (!bbox) return snapshot.val() as Record<string, Place>;

        if (bbox) {
          const places = snapshot.val() as Record<string, Place>;
          // Filtering lat since Firebase doesn't support multiple orderByChild
          const filteredLat = Object.entries(places).filter(([, place]) => {
            return (
              place.location.lat >= bbox[1] && place.location.lat <= bbox[3]
            );
          });
          return Object.fromEntries(filteredLat) as Record<string, Place>;
        }
      },
    },
  };
};

const _getQueryConstraints = ({
  category,
  bbox,
  limit,
  page,
  reference,
}: {
  category: CategoriesEnum | null;
  bbox: number[] | null;
  limit: number;
  page: number;
  reference: any;
}) => {
  if (category)
    return query(
      reference,
      orderByChild("category"),
      equalTo(category),
      limitToFirst(limit * page)
    );

  if (bbox)
    return query(
      reference,
      orderByChild("location/lng"),
      startAt(bbox[0]),
      endAt(bbox[2])
    );

  return query(reference, limitToFirst(limit * page));
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
}

interface Location {
  lat: number;
  lng: number;
}
