import {
  UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SavedPlaces } from "../types";
import initialSavedPlaces from "../bookmarks/initial-saved-places.json";
import { SAVED_PLACES_QUERY_KEY } from "../../client/constant";

const useBookmarkedPlaces = <T = SavedPlaces>(
  options: UseQueryOptions<SavedPlaces, unknown, T, string[]> = {}
) => {
  const client = useQueryClient();
  const { data: places, ...states } = useQuery(
    [SAVED_PLACES_QUERY_KEY],
    () => {
      const saved = client.getQueryData<SavedPlaces>([SAVED_PLACES_QUERY_KEY]);
      if (saved !== undefined) return saved;
      return initialSavedPlaces as SavedPlaces;
    },
    {
      placeholderData: {},
      staleTime: Infinity,
      ...options,
    }
  );

  return { places, ...states };
};

export const useIsBookmarkedPlace = (placeId: number) => {
  const { places } = useBookmarkedPlaces({ select: (sp) => !!sp[placeId] });
  return !!places;
};

export default useBookmarkedPlaces;
