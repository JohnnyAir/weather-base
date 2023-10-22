import { useCurrentPlace } from "../../place/useCurrentPlace";
import { useWeather } from "./useWeather";

export const useMyLocationWeather = () => {
  const { place } = useCurrentPlace();

  const { weather, isLoading, status } = useWeather({
    place: place || undefined,
    options: {
      refetchOnWindowFocus: true,
      keepPreviousData: true,
    },
  });

  return { weather, place, isLoading, status };
};
