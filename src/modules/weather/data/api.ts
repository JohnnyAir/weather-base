import { apiFetch } from "../../client/api";
import type { CurrentAndForecastApiResponse } from "../types";

const APP_ID = "211158a74590af681a5f6a978c12427e";
const baseURL = "https://api.openweathermap.org/data/2.5/";

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
