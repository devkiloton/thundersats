export interface GooglePlaceDetails {
  html_attributions: any[];
  result: Result;
  status: string;
}

export interface Result {
  formatted_phone_number: string | undefined;
  formatted_address: string | undefined;
  opening_hours: OpeningHours | undefined;
  photos: Photo[] | undefined;
  reviews: Review[] | undefined;
  user_ratings_total: number | undefined;
  website: string | undefined;
}

export interface OpeningHours {
  open_now: boolean;
  periods: Period[];
  weekday_text: string[];
}

export interface Period {
  close: Close;
  open: Open;
}

export interface Close {
  day: number;
  time: string;
}

export interface Open {
  day: number;
  time: string;
}

export interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface Review {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated: boolean;
}
