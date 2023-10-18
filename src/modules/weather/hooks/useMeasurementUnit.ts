import {
  useIsRestoring,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryClient } from "../../../client/client";
import { MeasurementUnit, PlaceWeather } from "../types";
import { useCallback } from "react";
import { formatWeatherDataValuesByUnit } from "../api/transformers";
import { UNIT_KEY } from "../../../client/constant";

const cacheKey = [UNIT_KEY];

export const useMeasurementUnit = () => {
  const client = useQueryClient();
  const disable = useIsRestoring();

  const { data: unit } = useQuery(
    cacheKey,
    () => queryClient.getQueryData<MeasurementUnit>(cacheKey) || "metric",
    {
      placeholderData: "metric" as const,
      staleTime: Infinity,
      enabled: !disable,
    }
  );

  const handleChangeUnit = (unit: MeasurementUnit) => {
    client.setQueryData<MeasurementUnit>(cacheKey, unit);
  };

  return { unit: unit || "metric", handleChangeUnit };
};

export const useApplyWeatherUnitFormatting = () => {
  const { unit } = useMeasurementUnit();

  const format = useCallback(
    (forecast: PlaceWeather) => formatWeatherDataValuesByUnit(forecast, unit),
    [unit]
  );

  return { unit, format };
};
