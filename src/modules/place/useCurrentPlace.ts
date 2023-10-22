import { useGeolocation } from "./useGeolocation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPlacefromGeoCoords } from "./api";
import { MS_TIME } from "../../client/constant";
import { GeoPlace } from "./types";
import { placeKeys } from "./store";

const getQueryKey = (
  coords: GeolocationCoordinates | null,
  lastKnownLocation: GeoPlace | null
) => {
  if (lastKnownLocation && !coords) {
    return placeKeys.single(lastKnownLocation.id);
  }

  return placeKeys.myLatestLocation({
    lat: coords?.latitude,
    lng: coords?.longitude,
  });
};

export const useCurrentPlace = () => {
  const { coords, error } = useGeolocation();
  const client = useQueryClient();

  const lastKnownLocation =
    client.getQueryData<GeoPlace>(placeKeys.myLastKnownLocation()) || null;

  const { data: place, ...currentPlaceQuery } = useQuery({
    queryKey: getQueryKey(coords, lastKnownLocation),
    queryFn: () => {
      if (!coords) return Promise.resolve(lastKnownLocation);
      return getPlacefromGeoCoords(coords.latitude, coords.longitude);
    },
    placeholderData: lastKnownLocation,
    staleTime: MS_TIME.FIVE_MINUTES,
    cacheTime: MS_TIME.FIVE_MINUTES,
    keepPreviousData: true,
    onSuccess: (place) => {
      if (place && place.id !== lastKnownLocation?.id) {
        client.setQueryData(placeKeys.myLastKnownLocation(), place);
      }
    },
  });

  return {
    place,
    geolocationError: error,
    ...currentPlaceQuery,
  };
};
