import { queryClient } from "../../client/client";
import {
  NOTES_QK,
  PLACE_QUERY_KEY,
  SAVED_PLACES_QUERY_KEY,
} from "../../client/constant";
import { GeoPlace } from "../search/types";
import { SavedPlaces } from "./types";

export const isSavedPlace = (placeId: number) => {
  const savedPlaces = queryClient.getQueryData<SavedPlaces>([
    SAVED_PLACES_QUERY_KEY,
  ]);
  return (savedPlaces && !!savedPlaces[placeId]) || false;
};

export const findSavedPlace = (placeId: number) => {
  const savedPlaces = queryClient.getQueryData<SavedPlaces>([
    SAVED_PLACES_QUERY_KEY,
  ]);
  const place = savedPlaces && savedPlaces[placeId];
  return place || null;
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
    const savedPlaces = Object.assign({}, sp);
    delete savedPlaces[place.id];
    return savedPlaces;
  });
  queryClient.removeQueries({ queryKey: [NOTES_QK, place.id], exact: true });
};
