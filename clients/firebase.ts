import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

export const firebaseClient = () => {
  return {
    places: {
      create: async (place: Place) => {
        const db = getDatabase();
        const user = getAuth().currentUser;
        set(ref(db, "places/" + user?.uid), place);
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
}

interface Location {
  lat: number;
  lng: number;
}
