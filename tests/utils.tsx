import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

export const renderWithQueryClient = (
  client: QueryClient,
  ui: React.ReactElement
) => {
  const user = userEvent.setup();
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>
      {ui}
      <div id="alert-root"></div>
    </QueryClientProvider>
  );
  return {
    user,
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={client}>
          {rerenderUi}
          <div id="alert-root"></div>
        </QueryClientProvider>
      ),
  };
};

export const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: Infinity,
        retry: false,
      },
    },
  });
};
