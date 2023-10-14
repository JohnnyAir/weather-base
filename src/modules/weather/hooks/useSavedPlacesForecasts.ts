import { useQueries } from "@tanstack/react-query";
import { getGeoPlaceForecast } from "../data";
import { MS_TIME } from "../../client/constant";
import { FormattedPlaceForecast } from "../types";
import { FORECAST_QUERY_KEY } from "../../client/constant";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";
import useSavedPlaces from "./useSavedPlaces";

function useSavedPlacesForecasts() {
  const { places: savedPlaces } = useSavedPlaces({
    select: (sp) => Object.values(sp),
  });
  const { format } = useApplyMeasurementUnitForecastFormatting();

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
