import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGeoPlaceForecast } from "../data";
import { MS_TIME } from "../../client/constant";
import { FormattedPlaceForecast, SavedPlaces } from "../types";
import initialSavedPlaces from "../SavedPlaces/initial-saved-places.json";
import {
  FORECAST_QUERY_KEY,
  SAVED_PLACES_QUERY_KEY,
} from "../../client/constant";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";

function useSavedPlacesForecasts() {
  const client = useQueryClient();
  const { format } = useApplyMeasurementUnitForecastFormatting();

  const { data: savedPlaces } = useQuery(
    [SAVED_PLACES_QUERY_KEY],
    () => {
      const saved = client.getQueryData<SavedPlaces>([SAVED_PLACES_QUERY_KEY]);
      if (saved !== undefined) return saved;
      return initialSavedPlaces as SavedPlaces;
    },
    {
      placeholderData: {},
      select: (sp) => Object.values(sp),
      staleTime: Infinity,
    }
  );

  const savedPlacesQueries = useQueries({
    queries: (savedPlaces || []).map((place) => {
      return {
        queryKey: [FORECAST_QUERY_KEY, place.id],
        queryFn: () => getGeoPlaceForecast(place),
        select: format,
        staleTime: MS_TIME.ONE_MINUTE,
        cacheTime: Infinity,
      };
    }),
  });

  const isLoading = savedPlacesQueries.some((q) => q.isLoading);

  const forecasts = savedPlacesQueries
    .map((q) => q.data)
    .filter((f) => typeof f !== "undefined") as FormattedPlaceForecast[];

  return { forecasts, isLoading };
}

export default useSavedPlacesForecasts;
