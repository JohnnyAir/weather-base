import { useNavigate } from "react-router";
import { useGeolocation } from "./useGeolocation";
import { useQuery } from "@tanstack/react-query";
import { getGeoPlaceForecast } from "../data";
import { getPlacefromGeoCoords } from "../../search/api";
import { MS_TIME } from "../../api/constant";
import { GeoPlace } from "../../search/types";
import { queryClient } from "../../api/client";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";
import { FORECAST_QUERY_KEY, PLACE_QUERY_KEY } from "../store";

export function useCurrentLocationWeather() {
  const { coords } = useGeolocation();
  const navigate = useNavigate();
  const { format } = useApplyMeasurementUnitForecastFormatting();

  const lastKnownLocation: GeoPlace | null =
    queryClient.getQueryData([PLACE_QUERY_KEY]) || null;

  const { data: place } = useQuery(
    ["latest-geo-place", { lat: coords?.latitude, lng: coords?.longitude }],
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
          queryClient.setQueryData([PLACE_QUERY_KEY], place);
        }
      },
    }
  );

  const {
    data: forecast,
    isLoading,
    status,
  } = useQuery(
    [FORECAST_QUERY_KEY, place?.id],
    async () => {
      if (!place) return null;
      const pf = await getGeoPlaceForecast(place);
      pf.meta = {
        __persists__: true,
      };
      return pf;
    },
    {
      staleTime: MS_TIME.ONE_MINUTE,
      enabled: !!place,
      refetchOnWindowFocus: true,
      keepPreviousData: true,
      cacheTime: Infinity,
      select: (f) => (f ? format(f) : null),
      onSuccess: () => {
        if (place && place?.id !== lastKnownLocation?.id) {
          queryClient.setQueryData([PLACE_QUERY_KEY, place.id], place);
          navigate(`/place/${place.id}`);
        }
      },
    }
  );

  return { forecast, isLoading, status };
}
