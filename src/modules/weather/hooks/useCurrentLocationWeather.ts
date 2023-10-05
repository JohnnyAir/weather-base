import { useEffect, useState } from "react";
import { findNearbyPlaceName } from "../../search/api";
import {
  saveCurrentCityWeatherAndForecasts,
  tryGetCurrentCityWeatherAndForecasts,
  updateCityWeatherAndForecasts,
} from "../functions";
import { CityWeatherAndForecast, MeasurementUnitState } from "../types";
import { apiFetchWeatherForecastByGeoCoords } from "../api";
import { useNavigate, useOutletContext } from "react-router";
import { convertWeatherMeasurementUnit } from "../data";

const getUserGeoCoordinates = async () => {
  return new Promise<GeolocationCoordinates | null>((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        () => resolve(null)
      );
    } else {
      resolve(null);
      console.error("Geolocation is not supported by this browser.");
    }
  });
};

export function useCurrentLocationWeather() {
  const [currentCityForecast, setCurrentCityForecast] =
    useState<CityWeatherAndForecast | null>(
      tryGetCurrentCityWeatherAndForecasts
    );

  const { unit } = useOutletContext<MeasurementUnitState>();
  const navigate = useNavigate();
  const currentCityId = currentCityForecast?.geonameId;

  useEffect(() => {
    let isActive = true;
    async function loadCurrentCityWeather() {
      const savedCurrentCity = tryGetCurrentCityWeatherAndForecasts();
      const coords = await getUserGeoCoordinates();
      //check if location is still the same
      if (coords) {
        try {
          const nearbyPlaces = await findNearbyPlaceName(
            coords.latitude,
            coords.longitude
          );

          const currentCity = nearbyPlaces.geonames[0];

          //new location? Yes - fetch and show new location
          if (savedCurrentCity?.geonameId !== currentCity.geonameId) {
            navigate(`/city/${currentCity.geonameId}`);

            const currentCityWeather = await apiFetchWeatherForecastByGeoCoords(
              currentCity.lat,
              currentCity.lng
            );

            const currentCityWeatherAndForecast = {
              ...currentCityWeather,
              geonameId: currentCity.geonameId,
              city: {
                name: currentCity.name,
                country: currentCity.countryName,
              },
              lastUpdateTime: new Date().getTime(),
            };
            if (isActive) {
              setCurrentCityForecast(currentCityWeatherAndForecast);
            }
            saveCurrentCityWeatherAndForecasts(currentCityWeatherAndForecast);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    loadCurrentCityWeather();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (currentCityId && document.visibilityState === "visible") {
        updateCityWeatherAndForecasts(currentCityId).then(
          (data) => data && setCurrentCityForecast(data)
        );
      }
    };

    update();
    document.addEventListener("visibilitychange", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
    };
  }, [currentCityId]);

  const transformedCityForecast = currentCityForecast
    ? convertWeatherMeasurementUnit(currentCityForecast, unit)
    : null;

  return {
    unit,
    currentCityForecast: transformedCityForecast,
  };
}
