import { UseQueryResult, useQueries } from "@tanstack/react-query";
import { getGeoPlaceForecast } from "../data";
import { MS_TIME } from "../../client/constant";
import { PlaceWeatherInfoWithUnit } from "../types";
import { FORECAST_QUERY_KEY } from "../../client/constant";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";
import useBookmarkedPlaces from "./useBookmarkedPlaces";
import { ApiError, createError } from "../../client/error";

const handleError = (
  queries: UseQueryResult<PlaceWeatherInfoWithUnit, unknown>[]
) => {
  const erroredQueriesWithNoData = queries.filter(
    (q) => q.isError && q.data === undefined
  );

  // all queries failed.
  if (erroredQueriesWithNoData.length === queries.length) {
    const error = erroredQueriesWithNoData[0].error as ApiError;
    throw createError(error.type, {
      message:
        "Unable to fetch weather data for saved places. Check internet connection and try again.",
      code: error.code,
      payload: erroredQueriesWithNoData.map((e) => e.error),
      isRetryable: error.isRetryable,
    });
  }
};

const useBookmarkedPlacesWeatherInfo = () => {
  const { places: savedPlaces } = useBookmarkedPlaces({
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

  handleError(savedPlacesQueries);

  const weathers = savedPlacesQueries
    .map((q) => q.data)
    .filter((f) => typeof f !== "undefined") as PlaceWeatherInfoWithUnit[];

  return { weathers, isLoading };
};

export default useBookmarkedPlacesWeatherInfo;
