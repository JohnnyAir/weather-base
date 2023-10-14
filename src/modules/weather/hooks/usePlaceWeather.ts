import { useQuery } from "@tanstack/react-query";
import { getPlaceById } from "../../search/api";
import { getGeoPlaceForecast } from "../data";
import {
  FORECAST_QUERY_KEY,
  MS_TIME,
  PLACE_QUERY_KEY,
} from "../../client/constant";
import { removePlace, savePlace } from "../store";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";
import { useIsBookmarkedPlace } from "./useBookmarkedPlaces";

const usePlaceWeather = (placeId: number) => {
  const { format } = useApplyMeasurementUnitForecastFormatting();

  const { data: place } = useQuery(
    [PLACE_QUERY_KEY, placeId],
    () => {
      return getPlaceById(placeId);
    },
    {
      staleTime: Infinity,
    }
  );

  const {
    data: weather,
    isLoading,
    status,
  } = useQuery(
    [FORECAST_QUERY_KEY, placeId],
    () => {
      if (!place) {
        throw "404";
      }
      return getGeoPlaceForecast(place);
    },
    {
      select: format,
      staleTime: MS_TIME.ONE_MINUTE,
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
