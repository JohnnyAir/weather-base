import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../api/client";
import { MeasurementUnit, PlaceForecast } from "../types";
import { useCallback } from "react";
import { formatForecastByUnit } from "../data/transformers";

const cacheKey = ["measurement-unit"];

export const useMeasurementUnit = () => {
  const client = useQueryClient();

  const { data: unit } = useQuery(
    cacheKey,
    () => queryClient.getQueryData<MeasurementUnit>(cacheKey) || "metric",
    { initialData: "metric" as const, staleTime: Infinity }
  );

  const handleChangeUnit = (unit: MeasurementUnit) => {
    client.setQueryData<MeasurementUnit>(cacheKey, unit);
  };

  return { unit, handleChangeUnit };
};

export const useApplyMeasurementUnitForecastFormatting = () => {
  const { unit } = useMeasurementUnit();

  const format = useCallback(
    (forecast: PlaceForecast) => formatForecastByUnit(forecast, unit),
    [unit]
  );

  return { unit, format };
};
