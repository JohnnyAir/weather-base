import { getPlaceById, getPlacefromGeoCoords } from "../../search/api";
import { GeoPlace } from "../../search/types";
import { normalizeWeatherForecast } from "./transformers";
import { apiFetchForecastForGeoCoords } from "./api";

export const getGeoCoordPlaceAndForecast = async (lat: number, lon: number) => {
  const [place, forecast] = await Promise.all([
    getPlacefromGeoCoords(lat, lon),
    apiFetchForecastForGeoCoords(lat, lon),
  ]);

  return normalizeWeatherForecast(place, forecast);
};

export const getGeoPlaceAndForecast = async (placeId: number) => {
  const place = await getPlaceById(placeId);
  const forecast = await apiFetchForecastForGeoCoords(place.lat, place.lon);
  return normalizeWeatherForecast(place, forecast);
};

export const getGeoPlaceForecast = async (place: GeoPlace) => {
  const forecast = await apiFetchForecastForGeoCoords(place.lat, place.lon);
  return normalizeWeatherForecast(place, forecast);
};
