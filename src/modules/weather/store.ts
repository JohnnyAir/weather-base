import { queryClient } from "../client/client";
import { PLACE_QUERY_KEY, SAVED_PLACES_QUERY_KEY } from "../client/constant";
import { GeoPlace } from "../search/types";
import { SavedPlaces } from "./types";

export const isSavedPlace = (placeId: number) => {
  const savedPlaces = queryClient.getQueryData<SavedPlaces>([
    SAVED_PLACES_QUERY_KEY,
  ]);
  return (savedPlaces && !!savedPlaces[placeId]) || false;
};

export const setPlace = (place: GeoPlace) =>
  queryClient.setQueryData([PLACE_QUERY_KEY, place.id], place);

export const savePlace = (place: GeoPlace) => {
  queryClient.setQueryData<SavedPlaces>([SAVED_PLACES_QUERY_KEY], (sp) => {
    const savedPlaces = sp || {};
    return savedPlaces[place.id] ? sp : { ...savedPlaces, [place.id]: place };
  });
};

export const removePlace = (place: GeoPlace) => {
  queryClient.setQueryData<SavedPlaces>([SAVED_PLACES_QUERY_KEY], (sp) => {
    const savedPlaces = sp || {};
    return savedPlaces[place.id]
      ? { ...savedPlaces, [place.id]: undefined }
      : sp;
  });
};
