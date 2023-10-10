import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { GeoPlace } from "../../search/types";
import { getGeoPlaceForecast } from "../data";
import { MS_TIME } from "../../api/constant";
import { FormattedPlaceForecast } from "../types";
import initialSavedPlaces from "../SavedPlaces/initial-saved-places.json";
import { FORECAST_QUERY_KEY, SAVED_PLACES_QUERY_KEY } from "../store";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";

function useSavedPlacesForecasts() {
  const client = useQueryClient();
  const { format } = useApplyMeasurementUnitForecastFormatting();

  const { data: savedPlaces } = useQuery(
    [SAVED_PLACES_QUERY_KEY],
    () => {
      const saved = client.getQueryData([SAVED_PLACES_QUERY_KEY]) as GeoPlace[];
      if (saved !== undefined) return saved;
      return initialSavedPlaces as GeoPlace[];
    },
    {
      staleTime: Infinity,
    }
  );

  const savedPlacesQueries = useQueries({
    queries: (savedPlaces || []).map((place) => {
      return {
        queryKey: [FORECAST_QUERY_KEY, place.id],
        queryFn: async () => {
          const sp = await getGeoPlaceForecast(place);
          sp["meta"] = {
            __persists__: true,
          };
          return sp;
        },
        select: format,
        staleTime: MS_TIME.ONE_MINUTE,
        cacheTime: Infinity,
      };
    }),
  });

  const isLoading =
    savedPlaces === undefined || savedPlacesQueries.some((q) => q.isLoading);

  const forecasts = savedPlacesQueries
    .map((q) => q.data)
    .filter((f) => typeof f !== "undefined") as FormattedPlaceForecast[];

  return { forecasts, isLoading };
}

export default useSavedPlacesForecasts;
