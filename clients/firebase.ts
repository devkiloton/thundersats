import {
  get,
  getDatabase,
  limitToFirst,
  query,
  ref,
  set,
} from "firebase/database";

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
      query: async ({ limit, page }: { limit: number; page: number }) => {
        const db = getDatabase();
        const reference = ref(db, "places");
        // TODO: Learn to paginate with Firebase realtime database
        const snapshot = await get(
          query(reference, limitToFirst(limit * page))
        );
        return snapshot.val() as Record<string, Place>;
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
