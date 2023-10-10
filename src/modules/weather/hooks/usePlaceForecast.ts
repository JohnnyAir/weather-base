import { useQuery } from "@tanstack/react-query";
import { getPlaceById } from "../../search/api";
import { getGeoPlaceForecast } from "../data";
import { MS_TIME } from "../../api/constant";
import {
  FORECAST_QUERY_KEY,
  PLACE_QUERY_KEY,
  isSavedPlace,
  removePlace,
  savePlace,
} from "../store";
import { useApplyMeasurementUnitForecastFormatting } from "./useMeasurementUnit";

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
    async () => {
      if (!place) {
        throw "404";
      }
      const pf = await getGeoPlaceForecast(place);
      if (isSavedPlace(pf.place.id)) {
        pf.meta = {
          __persists__: true,
        };
      }
      return pf;
    },
    {
      select: format,
      staleTime: MS_TIME.ONE_MINUTE,
      enabled: !!place,
    }
  );

  const isSaved = !!place && isSavedPlace(place?.id);

  const toggleSavePlace = () =>
    isSaved ? removePlace(place) : place && savePlace(place);

  return { forecast, isSaved, isLoading, status, toggleSavePlace };
}

export default usePlaceForecast;
