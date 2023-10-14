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
import { useIsSavedPlace } from "./useSavedPlaces";

function usePlaceForecast(placeId: number) {
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
    data: forecast,
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

  const isSaved = useIsSavedPlace(placeId);

  const toggleSavePlace = () => {
    if (place) {
      isSaved ? removePlace(place) : savePlace(place);
    }
  };

  return { forecast, isSaved, isLoading, status, toggleSavePlace };
}

export default usePlaceForecast;
