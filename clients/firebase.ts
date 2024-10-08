import {
  get,
  getDatabase,
  limitToLast,
  query,
  ref,
  set,
  startAt,
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
      query: async ({
        limit,
        start,
      }: {
        limit: number;
        start: number | string | null;
      }) => {
        const db = getDatabase();
        const reference = ref(db, "places");
        const snapshot = await get(
          query(reference, limitToLast(limit), startAt(start))
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
