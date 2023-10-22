import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { getGeoPlaceWeather } from "../api";
import { MS_TIME } from "../../../client/constant";
import { useMeasurementUnit } from "./useMeasurementUnit";
import { GeoPlace } from "../../place/types";
import { formatWeatherDataValuesByUnit } from "../api/transformers";
import { useCallback } from "react";
import { PlaceWeather, PlaceWeatherInfoWithUnit } from "../types";

type UsePlaceWeatherOptions = UseQueryOptions<
  PlaceWeather,
  unknown,
  PlaceWeatherInfoWithUnit,
  Array<string | number | undefined>
>;

type UsePlaceWeather = {
  place?: GeoPlace;
  options?: Omit<UsePlaceWeatherOptions, "select" | "queryKey" | "queryFn">;
};

export const weatherKeys = {
  all: () => ["geo-place-weather"],
  unit: () => ["unit"],
  place: (id?: number) => [...weatherKeys.all(), id],
};

export const createWeatherQuery = (place?: GeoPlace) => {
  return {
    queryKey: weatherKeys.place(place?.id),
    queryFn: () => {
      //should never happen.
      if (!place) {
        throw "never";
      }
      return getGeoPlaceWeather(place);
    },
    staleTime: MS_TIME.ONE_MINUTE,
    enabled: !!place,
  };
};

export const useWeather = ({ place, options = {} }: UsePlaceWeather) => {
  const { unit } = useMeasurementUnit();

  const format = useCallback(
    (forecast: PlaceWeather) => formatWeatherDataValuesByUnit(forecast, unit),
    [unit]
  );

  const { data: weather, ...weatherQuery } = useQuery<
    PlaceWeather,
    unknown,
    PlaceWeatherInfoWithUnit,
    Array<string | number | undefined>
  >({
    ...createWeatherQuery(place),
    select: format,
    ...options,
  });

  return { weather, ...weatherQuery };
};
