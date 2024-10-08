export const googleMapsClient = {
  places: {
    autocomplete: async (data: { input: string; locale: string }) => {
      return fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data.input}&language=${data.locale}&types=establishment&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
      );
    },
    details: async (data: { placeId: string; locale: string }) => {
      return fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.placeId}&fields=photo,name,international_phone_number,website,formatted_address,opening_hours,user_ratings_total,reviews,geometry&locationbias=ipbias&language=${data.locale}&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
      );
    },
  },
  urls: {
    photos: (data: { photoReference: string; maxWidth: number }) =>
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photoReference}&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`,
  },
};
