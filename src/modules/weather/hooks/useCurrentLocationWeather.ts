import { useNavigate } from "react-router";
import { useGeolocation } from "./useGeolocation";
import { useQuery } from "@tanstack/react-query";
import { getGeoPlaceForecast } from "../data";
import { getPlacefromGeoCoords } from "../../search/api";
import { LAST_KNOWN_LOCATION, MS_TIME } from "../../client/constant";
import { GeoPlace } from "../../search/types";
import { queryClient } from "../../client/client";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";
import { FORECAST_QUERY_KEY, PLACE_QUERY_KEY } from "../../client/constant";
import { useRef } from "react";
import { setPlace } from "../store";

export function useCurrentLocationWeather() {
  const { coords } = useGeolocation();
  const isNewLocation = useRef(false);

  const lastKnownLocation =
    queryClient.getQueryData<GeoPlace>([LAST_KNOWN_LOCATION]) || null;

  const coordPlaceKey = coords
    ? { lat: coords.latitude, lng: coords.longitude }
    : lastKnownLocation?.id;

  const { data: place } = useQuery(
    [PLACE_QUERY_KEY, coordPlaceKey],
    () => {
      if (!coords) return Promise.resolve(lastKnownLocation);
      return getPlacefromGeoCoords(coords.latitude, coords.longitude);
    },
    {
      placeholderData: lastKnownLocation,
      staleTime: MS_TIME.ONE_MINUTE,
      cacheTime: MS_TIME.ONE_MINUTE, // safe to clear from cache
      keepPreviousData: true,
      onSuccess: (place) => {
        if (place && place.id !== lastKnownLocation?.id) {
          isNewLocation.current = true;
          queryClient.setQueryData([LAST_KNOWN_LOCATION], place);
        }
      },
    }
  );

  const navigate = useNavigate();
  const { format } = useApplyMeasurementUnitForecastFormatting();

  // const;

  const {
    data: forecast,
    isLoading,
    status,
  } = useQuery(
    [FORECAST_QUERY_KEY, place?.id],
    async () => {
      if (!place) return null;
      const pf = await getGeoPlaceForecast(place);
      return pf;
    },
    {
      staleTime: MS_TIME.ONE_MINUTE,
      enabled: !!place,
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      cacheTime: Infinity,
      select: (f) => (f ? format(f) : null),
      onSuccess: (data) => {
        if (data && isNewLocation.current) {
          setPlace(data.place);
          isNewLocation.current = false;
          navigate(`/city/${data.place.id}`);
        }
      },
    }
  );

  return { forecast, isLoading, status };
}
