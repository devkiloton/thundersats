export const googleMapsClient = {
  places: {
    autocomplete: async (data: { input: string; locale: string }) => {
      return fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data.input}&language=${data.locale}&types=establishment&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
      );
    },
    details: async (data: { placeId: string; locale: string }) => {
      return fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${data.placeId}&fields=photo,formatted_phone_number,formatted_address,opening_hours,user_ratings_total,website,reviews,geometry&locationbias=ipbias&language=${data.locale}&key=${process.env.EXPO_PUBLIC_GCP_MAPS_API_KEY}`
      );
    },
  },
};
