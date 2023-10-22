import { noteKeys } from "../notes/query";
import { GeoPlace } from "./types";
import { QueryClient } from "@tanstack/react-query";

export const placeQueryKey = "geo-place";

export const placeKeys = {
  all: () => [placeQueryKey],
  single: (id: number) => [placeQueryKey, id],
  saved: () => ["bookmarked-places"],
  search: (text: string) => ["search", text],
  myLatestLocation: (coords: { lat?: number; lng?: number }) => [
    placeQueryKey,
    coords,
  ],
  myLastKnownLocation: () => [placeQueryKey, "current"],
};

export const addPlaceToBookmarks = (client: QueryClient, place: GeoPlace) => {
  client.setQueryData<GeoPlace>(placeKeys.single(place.id), (sp) => {
    return { ...sp, ...place, bookmarked: true };
  });
  client.invalidateQueries({ queryKey: placeKeys.saved(), refetchType: "all" });
};

export const removePlaceFromBookmarks = (
  client: QueryClient,
  placeId: number
) => {
  client.setQueryData<GeoPlace>(placeKeys.single(placeId), (sp) => {
    return sp ? { ...sp, bookmarked: false } : sp;
  });
  client.invalidateQueries({ queryKey: placeKeys.saved(), refetchType: "all" });
  client.resetQueries({
    queryKey: [noteKeys.group(placeId), placeId],
    exact: true,
  });
};
