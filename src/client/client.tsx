import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Query, QueryClient, QueryState } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  WEATHER_QUERY_KEY,
  LAST_KNOWN_LOCATION,
  PERSISTED_QUERYS,
} from "./constant";
import { isSavedPlace } from "../modules/weather/store";
import { PlaceWeather } from "../modules/weather/types";
import { GeoPlace } from "../modules/search/types";

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

const shouldDehydrateWeatherQuery = (state: QueryState<PlaceWeather>) => {
  if (state.data) {
    const isSaved = isSavedPlace(state.data.place.id);
    if (isSaved) return isSaved;
    const isLastKnownPlace = queryClient.getQueryData<GeoPlace>([
      LAST_KNOWN_LOCATION,
    ]);
    return state.data.place.id === isLastKnownPlace?.id;
  }
  return false;
};

const shouldDehydrateQuery = (query: Query) => {
  const queryGroupKey = query.queryKey[0] as string;

  if (queryGroupKey === WEATHER_QUERY_KEY) {
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
