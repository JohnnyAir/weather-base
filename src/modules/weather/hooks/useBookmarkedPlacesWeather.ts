import { UseQueryResult, useQueries } from "@tanstack/react-query";
import type { PlaceAndWeather, PlaceWeather } from "../types";
import { usePlacesBookmarks } from "../../place/useBookmarkedPlaces";
import { ApiError, createError } from "../../../client/error";
import { createWeatherQuery } from "./useWeather";
import { useMeasurementUnit } from "./useMeasurementUnit";
import { formatWeatherDataValuesByUnit } from "../api/transformers";

const handleError = (queries: UseQueryResult<PlaceAndWeather, unknown>[]) => {
  const erroredQueriesWithNoData = queries.filter(
    (q) => q.isError && q.data === undefined
  );

  // all queries failed.
  if (queries.length && erroredQueriesWithNoData.length === queries.length) {
    const error = erroredQueriesWithNoData[0].error as ApiError;
    throw createError(error.type, {
      message:
        "Unable to fetch weather data for bookmarks. Check internet connection and try again.",
      code: error.code,
      payload: erroredQueriesWithNoData.map((e) => e.error),
      isRetryable: error.isRetryable,
    });
  }
};

export const useBookmarkedPlacesWeather = () => {
  const { places, addToBookmarks, removeFromBookmarks } = usePlacesBookmarks();
  const { unit } = useMeasurementUnit();

  const savedPlacesQueries = useQueries({
    queries: (places || []).map((place) => {
      return {
        ...createWeatherQuery(place),
        select: (weather: PlaceWeather) => {
          return {
            weather: formatWeatherDataValuesByUnit(weather, unit),
            place,
          };
        },
        cacheTime: Infinity,
      };
    }),
  });

  const isLoading = savedPlacesQueries.some((q) => q.isLoading);

  handleError(savedPlacesQueries);

  const weathers = savedPlacesQueries
    .map((q) => q.data)
    .filter((f) => typeof f !== "undefined") as Array<PlaceAndWeather>;

  return { weathers, isLoading, addToBookmarks, removeFromBookmarks };
};
