import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Query, QueryClient, QueryState } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PERSISTED_QUERYS } from "./constant";
import { placeKeys, placeQueryKey } from "../modules/place/store";
import { PlaceWeather } from "../modules/weather/types";
import { GeoPlace } from "../modules/place/types";
import { weatherKeys } from "../modules/weather/hooks/useWeather";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const shouldDehydratePlaceQuery = (query: Query<GeoPlace>) => {
  const isCurrentPlaceQuery =
    query.queryKey[1] === placeKeys.myLastKnownLocation()[1];

  return !!query.state.data?.bookmarked || isCurrentPlaceQuery;
};

const shouldDehydrateWeatherQuery = (state: QueryState<PlaceWeather>) => {
  if (!state.data) return false;

  const lastKnownPlace = queryClient.getQueryData<GeoPlace>(
    placeKeys.myLastKnownLocation()
  );

  const place = queryClient.getQueryData<GeoPlace>(
    placeKeys.single(state.data.placeId)
  );

  return (
    !!(place && place.bookmarked) || state.data.placeId === lastKnownPlace?.id
  );
};

const shouldDehydrateQuery = (query: Query) => {
  if (!query.state.data) {
    return false;
  }

  const queryGroupKey = query.queryKey[0] as string;

  if (queryGroupKey === placeQueryKey)
    return shouldDehydratePlaceQuery(query as Query<GeoPlace>);

  if (queryGroupKey === weatherKeys.all()[0]) {
    return shouldDehydrateWeatherQuery(query.state as QueryState<PlaceWeather>);
  }

  return PERSISTED_QUERYS.includes(queryGroupKey);
};

export function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Infinity,
        dehydrateOptions: {
          shouldDehydrateQuery,
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
