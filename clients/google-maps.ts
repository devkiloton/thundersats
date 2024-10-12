export const googleMapsClient = {
  places: {
    autocomplete: async (data: {
      input: string;
      locale: string;
      coordinates: number[];
    }) => {
      return fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
          data.input
        }&language=${data.locale}&${
          data.coordinates.length == 2
            ? `location=${data.coordinates[0]},${data.coordinates[1]}`
            : "locationbias=ipbias"
        }&types=establishment&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
      );
    },
    details: async (data: { placeId: string; locale: string }) => {
      return fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.placeId}&fields=rating,price_level,wheelchair_accessible_entrance,photo,name,international_phone_number,website,formatted_address,opening_hours,user_ratings_total,reviews,geometry&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
      );
    },
  },
  urls: {
    photos: (data: { photoReference?: string | null; maxWidth: number }) =>
      data.photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${data.maxWidth}&photoreference=${data.photoReference}&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
        : `https://via.placeholder.com/${data.maxWidth}`,
  },
};
