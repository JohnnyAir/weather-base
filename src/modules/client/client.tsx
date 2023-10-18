import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryState } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  FORECAST_QUERY_KEY,
  LAST_KNOWN_LOCATION,
  PERSISTED_QUERYS,
} from "./constant";
import { isSavedPlace } from "../weather/store";
import { PlaceWeather } from "../weather/types";
import { GeoPlace } from "../search/types";

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

const shouldPersistForecast = (state: QueryState<PlaceWeather>) => {
  if (state.data) {
    const isSaved = isSavedPlace((state.data as PlaceWeather).place.id);
    if (isSaved) return isSaved;
    const isLastKnownPlace = queryClient.getQueryData<GeoPlace>([
      LAST_KNOWN_LOCATION,
    ]);
    return state.data.place.id === isLastKnownPlace?.id;
  }
  return false;
};

export function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Infinity,
        dehydrateOptions: {
          shouldDehydrateQuery: ({ queryKey, state }) => {
            if (PERSISTED_QUERYS.includes(queryKey[0] as string)) {
              return true;
            }

            if (queryKey[0] === FORECAST_QUERY_KEY) {
              return shouldPersistForecast(state as QueryState<PlaceWeather>);
            }

            if (
              queryKey[0] === "notes" &&
              queryKey[1] &&
              isSavedPlace(queryKey[1] as number)
            ) {
              return true;
            }

            return false;
          },
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
