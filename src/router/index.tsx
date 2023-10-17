import { Navigate, generatePath } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout";
import ErrorFallBack from "../modules/error/ErrorFallBack";
import HomePage from "../pages/Home";
import PlaceWeatherAndForecastPage from "../pages/PlaceWeather";
import FourZeroFour from "../pages/404";

export const routes = {
  home: {
    path: "/",
  },
  place: {
    path: "/place/:id",
    url: (id: number | string) =>
      generatePath(routes.place.path, { id: `${id}` }),
  },
  notFound: {
    path: "/404",
  },
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorFallBack />,
    children: [
      {
        path: routes.home.path,
        element: <HomePage />,
      },
      {
        path: routes.place.path,
        element: <PlaceWeatherAndForecastPage />,
      },
      {
        path: routes.notFound.path,
        element: <FourZeroFour />,
      },
      {
        path: "*",
        element: <Navigate to={routes.notFound.path} />,
      },
    ],
  },
]);
