import { apiFetch } from "../api/api";
import { getPlace } from "../search/api/api";
import { LocationGeoInfo } from "../search/types";
import defaultCiies from "./default-cities.json";
import type {
  CityWeatherAndForecast,
  CurrentAndForecastApiResponse,
} from "./types";

const APP_ID = "44a475ea84a260b6025c71336e16ea10";
const baseURL = "https://api.openweathermap.org/data/3.0/";

export const apiFetchWeatherForecastByGeoCoords = async (
  lat: string | number,
  lon: string | number
): Promise<CurrentAndForecastApiResponse> => {
  const endpoint = `${baseURL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${APP_ID}`;

  const response = await apiFetch(endpoint);
  const data = await response.json();

  return data;
};

export const apiFetchCityWeatherForecast = async (
  geonameId: number | string,
  city?: LocationGeoInfo
): Promise<CityWeatherAndForecast> => {
  const geoPlace = city || (await getPlace(geonameId));
  const forecastResponse = await apiFetchWeatherForecastByGeoCoords(
    geoPlace.lat,
    geoPlace.lng
  );

  const forecast: CityWeatherAndForecast = {
    ...forecastResponse,
    geonameId: geoPlace.geonameId,
    city: {
      name: geoPlace.name,
      country: geoPlace.countryName,
    },
    lastUpdateTime: new Date().getTime()
  };
  return forecast;
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

export const fetchInitialCitiesWeatherForecasts = async (): Promise<
  CityWeatherAndForecast[]
> => {
  return Promise.all(
    defaultCiies.map((c) =>
      apiFetchWeatherForecastByGeoCoords(c.latitude, c.longitude)
    )
  ).then((weathers) => {
    return weathers.map((weather, index) => ({
      ...weather,
      geonameId: defaultCiies[index].geonameId,
      lastUpdateTime: new Date().getTime(),
      city: {
        name: defaultCiies[index].city,
        country: defaultCiies[index].country,
      },
    }));
  });
};
