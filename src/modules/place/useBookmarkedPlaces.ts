import {
  Query,
  QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import initialSavedPlaces from "./initial-saved-places.json";
import {
  placeKeys,
  addPlaceToBookmarks,
  removePlaceFromBookmarks,
} from "./store";
import { GeoPlace } from "./types";

const getBookmarkedPlacesFromQueries = (client: QueryClient) => {
  const queryKeyAndData = client.getQueriesData<GeoPlace>({
    queryKey: placeKeys.all(),
    predicate: (query: Query) => {
      const data = query.state.data as GeoPlace;
      return !!(data && data.bookmarked);
    },
  });

  return queryKeyAndData.reduce<GeoPlace[]>((places, keyAndData) => {
    const place = keyAndData[1];
    if (place) {
      places.push(place);
    }
    return places;
  }, []);
};

const getOrInitializeBookmarks = (client: QueryClient) => {
  const isInitialized = localStorage.getItem("bookmark-initialized");
  if (isInitialized) return getBookmarkedPlacesFromQueries(client);
  localStorage.setItem("bookmark-initialized", "true");
  initialSavedPlaces.map((p) => client.setQueryData(placeKeys.single(p.id), p));
  return initialSavedPlaces as GeoPlace[];
};

export const usePlacesBookmarks = () => {
  const client = useQueryClient();

  const { data: places, ...states } = useQuery({
    queryKey: placeKeys.saved(),
    queryFn: () => {
      return getOrInitializeBookmarks(client);
    },
    placeholderData: [],
    staleTime: Infinity,
    networkMode: "offlineFirst",
  });

  const addToBookmarks = (place: GeoPlace) => {
    addPlaceToBookmarks(client, place);
  };

  const removeFromBookmarks = (placeId: number) => {
    removePlaceFromBookmarks(client, placeId);
  };

  return { ...states, places, addToBookmarks, removeFromBookmarks };
};
