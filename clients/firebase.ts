import {
  equalTo,
  get,
  getDatabase,
  limitToFirst,
  orderByChild,
  query,
  ref,
  set,
} from "firebase/database";
import { CategoriesEnum } from "../constants/categories";

export const firebaseClient = () => {
  return {
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
      }: {
        limit: number;
        page: number;
        category?: CategoriesEnum | null;
      }) => {
        const db = getDatabase();
        const reference = ref(db, "places");

        const queryWithCategory = query(
          reference,
          orderByChild("category"),
          equalTo(category),
          limitToFirst(limit * page)
        );

        const queryWithoutCategory = query(
          reference,
          limitToFirst(limit * page)
        );
        // TODO: Learn to paginate with Firebase realtime database
        const snapshot = await get(
          category ? queryWithCategory : queryWithoutCategory
        );
        return snapshot.val() as Record<string, Place> | null;
      },
    },
  };
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
}

interface Location {
  lat: number;
  lng: number;
}
