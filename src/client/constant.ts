const ONE_SECOND_IN_MS = 1000;

const ONE_MINUTE = 60 * ONE_SECOND_IN_MS;

export const MS_TIME = {
  TEN_SECONDS: 10 * ONE_SECOND_IN_MS,
  TWENTY_SECONDS: 20 * ONE_SECOND_IN_MS,
  THIRTY_SECONDS: 30 * ONE_SECOND_IN_MS,
  ONE_MINUTE: ONE_MINUTE,
  FIVE_MINUTES: 5 * ONE_MINUTE,
};

//Query Keys
export const UNIT_KEY = "measurement-unit";
export const PLACE_QUERY_KEY = "geo-place";
export const SAVED_PLACES_QUERY_KEY = "saved-places";
export const WEATHER_QUERY_KEY = "geo-place-weather";
export const LAST_KNOWN_LOCATION = "last-known-location";
export const NOTES_QK = "notes";

export const PERSISTED_QUERYS = [
  SAVED_PLACES_QUERY_KEY,
  LAST_KNOWN_LOCATION,
  NOTES_QK,
  UNIT_KEY,
];
