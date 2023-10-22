import { GeoPlace } from "../../place/types";
import { normalizeWeatherForecast } from "./transformers";
import { apiFetchForecastForGeoCoords } from "./api";

export const getGeoPlaceWeather = async (place: GeoPlace) => {
  const forecast = await apiFetchForecastForGeoCoords(place.lat, place.lon);
  return normalizeWeatherForecast(place, forecast);
};
