import { apiFetch } from "../../client/api";
import type { CurrentAndForecastApiResponse } from "../types";

const baseURL = "https://api.openweathermap.org/data/2.5/";
const APP_ID = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export const apiFetchForecastForGeoCoords = async (
  lat: string | number,
  lon: string | number
): Promise<CurrentAndForecastApiResponse> => {
  const endpoint = `${baseURL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${APP_ID}`;

  const response = await apiFetch(endpoint);
  const data = await response.json();

  return data;
};

export const apiFetchCityNameFromGeoCoords = async (
  lat: string | number,
  lon: string | number
) => {
  const endpoint = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=2&appid=${APP_ID}`;

  const response = await apiFetch(endpoint);
  const data = await response.json();

  return data;
};
