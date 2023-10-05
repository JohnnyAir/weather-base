import { getDifferenceInMinutes } from "../../utils/time";
import { replaceGroupNotes } from "../notes/functions";
import { apiFetchWeatherForecastByGeoCoords } from "./api";
import {
  CityWeatherAndForecast,
  MeasurementUnit,
  SavedWeathers,
} from "./types";

const currentWeatherStoreKey = "currentLocation";
const savedCitiesWeatherKey = "weathers";

export function saveCityWeatherAndForecasts(
  cityWeatherData: CityWeatherAndForecast
): void {
  try {
    const storedWeathersString =
      localStorage.getItem(savedCitiesWeatherKey) || "{}";
    let storedWeathers: SavedWeathers = {};
    if (storedWeathersString) {
      storedWeathers = JSON.parse(storedWeathersString);
    }

    const storedCityData = storedWeathers[cityWeatherData.geonameId] || {};

    const updatedWeathers = {
      ...storedWeathers,
      [cityWeatherData.geonameId]: {
        ...storedCityData,
        ...cityWeatherData,
        lastUpdateTime: new Date().getTime(),
      },
    };
    localStorage.setItem(
      savedCitiesWeatherKey,
      JSON.stringify(updatedWeathers)
    );
  } catch (error) {}
}

export function saveMultipleCityWeatherAndForecasts(
  cityWeatherData: CityWeatherAndForecast[]
): void {
  const lastUpdateTime = new Date().getTime();
  try {
    const storedWeathersString =
      localStorage.getItem(savedCitiesWeatherKey) || "{}";
    let storedWeathers: SavedWeathers = {};
    if (storedWeathersString) {
      storedWeathers = JSON.parse(storedWeathersString);
    }

    const updatedWeathers = cityWeatherData.reduce(
      (allCitiesWeather, cityWeather) => {
        const storedCityData = allCitiesWeather[cityWeather.geonameId] || {};
        return {
          ...allCitiesWeather,
          [cityWeather.geonameId]: {
            ...storedCityData,
            ...cityWeather,
            lastUpdateTime,
          },
        };
      },
      storedWeathers
    );

    localStorage.setItem(
      savedCitiesWeatherKey,
      JSON.stringify(updatedWeathers)
    );
  } catch (error) {}
}

export function tryGetSavedWeatherAndForecasts(): SavedWeathers | null {
  try {
    const storedWeathersString = localStorage.getItem(savedCitiesWeatherKey);
    if (storedWeathersString) {
      let savedWeathers: SavedWeathers = JSON.parse(storedWeathersString);
      return savedWeathers;
    }
  } catch (error) {}
  return null;
}

export function tryGetCityStoredWeatherAndForecasts(
  id: number | string,
  includeCurrentLocation: boolean | undefined = true
): (CityWeatherAndForecast & { isSavedCurrentLocation?: boolean }) | null {
  try {
    const storedWeathersString =
      localStorage.getItem(savedCitiesWeatherKey) || "{}";
    let savedWeathers: SavedWeathers = {};
    if (storedWeathersString) {
      savedWeathers = JSON.parse(storedWeathersString);
    }

    let cityData = savedWeathers[id] || null;

    if (!cityData && includeCurrentLocation) {
      const currentWeatherStr = localStorage.getItem(currentWeatherStoreKey);
      if (currentWeatherStr) {
        let currentWeather: CityWeatherAndForecast =
          JSON.parse(currentWeatherStr);
        currentWeather.isCurrentLocation = true;
        cityData =
          String(currentWeather.geonameId) === String(id)
            ? currentWeather
            : cityData;
      }
    }

    return cityData;
  } catch (error) {
    return null;
  }
}

export function deleteCityStoredWeatherAndForecasts(id: number | string) {
  try {
    const storedWeathersString =
      localStorage.getItem(savedCitiesWeatherKey) || "{}";
    let storedWeathers: SavedWeathers = {};
    if (storedWeathersString) {
      storedWeathers = JSON.parse(storedWeathersString);
    }

    const storedCityData = storedWeathers[id];

    if (storedCityData) {
      const updatedWeathers = {
        ...storedWeathers,
        [id]: undefined,
      };
      localStorage.setItem(
        savedCitiesWeatherKey,
        JSON.stringify(updatedWeathers)
      );
    }

    const currentCity = tryGetCurrentCityWeatherAndForecasts();
    if (currentCity && currentCity.geonameId === storedCityData.geonameId) {
      saveCurrentCityWeatherAndForecasts({
        ...currentCity,
        is_favorite: false,
      });
    }
    replaceGroupNotes(Number(id), []);
  } catch (error) {}
}

export function saveCurrentCityWeatherAndForecasts(
  cityWeatherData: CityWeatherAndForecast
): void {
  try {
    localStorage.setItem(
      currentWeatherStoreKey,
      JSON.stringify({
        ...cityWeatherData,
        lastUpdateTime: new Date().getTime(),
      })
    );
  } catch (error) {}
}

export function tryGetCurrentCityWeatherAndForecasts(): CityWeatherAndForecast | null {
  try {
    const storedWeathersString = localStorage.getItem(currentWeatherStoreKey);
    if (storedWeathersString) {
      return JSON.parse(storedWeathersString) as CityWeatherAndForecast;
    }
  } catch (error) {}
  return null;
}

export function isWeatherDataStale(data: CityWeatherAndForecast) {
  return getDifferenceInMinutes(new Date(), new Date(data.lastUpdateTime)) < -2;
}

export function updateSavedCityWeatherAndForecastsIfAvailable(
  cityWeatherData: CityWeatherAndForecast
): void {
  try {
    const citySavedData = tryGetCityStoredWeatherAndForecasts(
      cityWeatherData.geonameId,
      false
    );
    if (citySavedData) {
      saveCityWeatherAndForecasts(cityWeatherData);
    }

    const currentWeatherInfo = tryGetCurrentCityWeatherAndForecasts();
    if (
      currentWeatherInfo &&
      currentWeatherInfo.geonameId === cityWeatherData.geonameId
    ) {
      saveCurrentCityWeatherAndForecasts(cityWeatherData);
    }
  } catch (error) {}
}

export async function updateCityWeatherAndForecasts(id: number) {
  const data = tryGetCityStoredWeatherAndForecasts(id);

  if (!data || !isWeatherDataStale(data)) {
    return null;
  }

  const newForecast = await apiFetchWeatherForecastByGeoCoords(
    data.lat,
    data.lon
  );
  const updatedData: CityWeatherAndForecast = { ...data, ...newForecast };

  updateSavedCityWeatherAndForecastsIfAvailable(updatedData);

  return updatedData;
}

export const updateCitiesWeatherForecasts = async (): Promise<
  CityWeatherAndForecast[] | null
> => {
  const savedCities = tryGetSavedWeatherAndForecasts();

  if (!savedCities) return null;

  const staleWeathers = Object.values(savedCities).filter((w) =>
    isWeatherDataStale(w)
  );

  if (!staleWeathers.length) {
    return null;
  }

  const updatedCities = await Promise.all(
    staleWeathers.map((c) => apiFetchWeatherForecastByGeoCoords(c.lat, c.lon))
  ).then((weathers) => {
    return weathers.reduce((acc, weather, index) => {
      acc[staleWeathers[index].geonameId] = {
        ...staleWeathers[index],
        ...weather,
      };
      return acc;
    }, savedCities);
  });

  saveMultipleCityWeatherAndForecasts(Object.values(updatedCities));
  return sortSavedWeatherData(updatedCities);
};

export function sortByCityName(data: CityWeatherAndForecast[]) {
  return data.sort((a, b) => a.city.name.localeCompare(b.city.name));
}

export function sortSavedWeatherData(weatherData: SavedWeathers) {
  const [savedFavorites, savedTopCites] = Object.values(weatherData).reduce<
    CityWeatherAndForecast[][]
  >(
    (acc, cityWeatherData) => {
      if (cityWeatherData.is_favorite) {
        acc[0].push(cityWeatherData);
      } else {
        acc[1].push(cityWeatherData);
      }
      return acc;
    },
    [[], []]
  );

  const sortedTopCites = sortByCityName(savedTopCites);
  const sortedFavourites = sortByCityName(savedFavorites);

  const data = [...(sortedFavourites || []), ...(sortedTopCites || [])];

  return data;
}

export function getSavedUnit(): MeasurementUnit {
  const savedUnit = localStorage.getItem("unit");
  return (savedUnit as MeasurementUnit) || "metric";
}
