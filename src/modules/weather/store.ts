import { queryClient } from "../api/client";
import { GeoPlace } from "../search/types";
import { PlaceForecast } from "./types";

export const PLACE_QUERY_KEY = "geo-place";
export const SAVED_PLACES_QUERY_KEY = "saved-places";
export const FORECAST_QUERY_KEY = "geo-place-forecast";

export const isSavedPlace = (placeId: number) => {
  const savedPlaces = queryClient.getQueryData<GeoPlace[]>(["saved-places"]);
  return (savedPlaces && savedPlaces.some((sp) => sp.id === placeId)) || false;
};

export const setPlace = (place: GeoPlace) =>
  queryClient.setQueryData([PLACE_QUERY_KEY, place.id], place);

export const savePlace = (place: GeoPlace) => {
  queryClient.setQueryData<GeoPlace[]>([SAVED_PLACES_QUERY_KEY], (sp) => {
    const savedPlaces = sp || [];
    const isSaved = sp?.some((p) => p.id === place.id);
    return isSaved ? sp : [...savedPlaces, place];
  });

  queryClient.setQueryData<PlaceForecast>(
    [FORECAST_QUERY_KEY, place.id],
    (pf) => {
      if (pf) {
        return { ...pf, meta: { __persists__: true } };
      }
    }
  );
};

export const removePlace = (place: GeoPlace) => {
  queryClient.setQueryData<GeoPlace[]>([SAVED_PLACES_QUERY_KEY], (sp) => {
    return sp?.filter((p) => p.id !== place.id);
  });

  queryClient.setQueryData<PlaceForecast>(
    [FORECAST_QUERY_KEY, place.id],
    (pf) => {
      if (pf) {
        return { ...pf, meta: { __persists__: false } };
      }
    }
  );
};
