import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPlaceToBookmarks,
  placeKeys,
  removePlaceFromBookmarks,
} from "./store";
import { getPlaceById } from "./api";
import { GeoNameApiError, GeoPlace } from "./types";

export const usePlace = (placeId: number) => {
  const client = useQueryClient();
  
  const { data: place, ...placeQuery } = useQuery<GeoPlace, GeoNameApiError>({
    queryKey: placeKeys.single(placeId),
    queryFn: () => getPlaceById(placeId),
    useErrorBoundary: (_, query) => {
      //only use errorboundary if there is no previous data, not for backgroud updates.
      return !query.state.data;
    },
    staleTime: Infinity,
  });

  const addToBookmarks = () => {
    if (place) {
      addPlaceToBookmarks(client, place);
    }
  };

  const removeFromBookmarks = () => {
    if (place) {
      removePlaceFromBookmarks(client, place.id);
    }
  };

  return {
    place,
    placeQuery,
    addToBookmarks,
    removeFromBookmarks,
  };
};
