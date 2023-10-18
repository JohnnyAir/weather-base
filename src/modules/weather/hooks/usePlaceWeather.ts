import { useQuery } from "@tanstack/react-query";
import { getPlaceById } from "../../search/api";
import { getGeoPlaceForecast } from "../api";
import {
  WEATHER_QUERY_KEY,
  MS_TIME,
  PLACE_QUERY_KEY,
} from "../../../client/constant";
import { findSavedPlace, removePlace, savePlace } from "../store";
import { useApplyWeatherUnitFormatting } from "./useMeasurementUnit";
import { useIsBookmarkedPlace } from "./useBookmarkedPlaces";

const usePlaceWeather = (placeId: number) => {
  const { format } = useApplyWeatherUnitFormatting();

  const placeQueryKey = [PLACE_QUERY_KEY, placeId];

  const { data: place } = useQuery(
    placeQueryKey,
    () => {
      const savedPlace = findSavedPlace(placeId);
      if (savedPlace) {
        return savedPlace;
      }
      return getPlaceById(placeId);
    },
    {
      useErrorBoundary: (_, query) => {
        //only use errorboundary if there is no previous data, not for backgroud updates.
        return !query.state.data;
      },
      staleTime: Infinity,
    }
  );

  const {
    data: weather,
    isLoading,
    status,
  } = useQuery(
    [WEATHER_QUERY_KEY, placeId],
    () => {
      //should never happen.
      if (!place) {
        throw "never";
      }
      return getGeoPlaceForecast(place);
    },
    {
      select: format,
      staleTime: MS_TIME.ONE_MINUTE,
      useErrorBoundary: (_, query) => {
        return !query.state.data;
      },
      enabled: !!place,
    }
  );

  const isBookmarked = useIsBookmarkedPlace(placeId);

  const toggleSavePlace = () => {
    if (place) {
      isBookmarked ? removePlace(place) : savePlace(place);
    }
  };

  return { weather, isBookmarked, isLoading, status, toggleSavePlace };
};

export default usePlaceWeather;
