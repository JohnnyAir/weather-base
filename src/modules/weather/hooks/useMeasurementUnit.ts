import {
  useIsRestoring,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryClient } from "../../../client/client";
import { MeasurementUnit } from "../types";

export const measurementUnitQueryKey = ["measurement-unit"];

export const useMeasurementUnit = () => {
  const client = useQueryClient();
  const disable = useIsRestoring();

  const { data: unit } = useQuery(
    measurementUnitQueryKey,
    () =>
      queryClient.getQueryData<MeasurementUnit>(measurementUnitQueryKey) ||
      "metric",
    {
      placeholderData: "metric" as const,
      staleTime: Infinity,
      enabled: !disable,
    }
  );

  const handleChangeUnit = (unit: MeasurementUnit) => {
    client.setQueryData<MeasurementUnit>(measurementUnitQueryKey, unit);
  };

  return { unit: unit || "metric", handleChangeUnit };
};
