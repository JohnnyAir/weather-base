import { useEffect, useState } from "react";
import { fetchInitialCitiesWeatherForecasts } from "../api";
import { CityWeatherAndForecast, MeasurementUnit } from "../types";
import {
  saveMultipleCityWeatherAndForecasts,
  sortByCityName,
  sortSavedWeatherData,
  tryGetSavedWeatherAndForecasts,
  updateCitiesWeatherForecasts,
} from "../functions";
import { useOutletContext } from "react-router";
import { convertWeathersMeasurementUnit } from "../data";

const loadSavedCitiesWeather = () => {
  const savedWeatherData = tryGetSavedWeatherAndForecasts();
  return savedWeatherData ? sortSavedWeatherData(savedWeatherData) : null;
};

function useWeather() {
  const [citiesWeather, setCitiesWeather] = useState<
    CityWeatherAndForecast[] | null
  >(loadSavedCitiesWeather);

  const { unit } = useOutletContext<{ unit: MeasurementUnit }>();

  const [loading, setIsLoading] = useState<boolean>(!citiesWeather);

  useEffect(() => {
    let isMounted = true;
    const savedWeatherData = tryGetSavedWeatherAndForecasts();
    const hasLodedDefaults = localStorage.getItem("defaults-loaded") === "true";
    if (savedWeatherData === null || !hasLodedDefaults) {
      setIsLoading(true);
      fetchInitialCitiesWeatherForecasts().then((citiesForecasts) => {
        localStorage.setItem("defaults-loaded", "true");
        saveMultipleCityWeatherAndForecasts(citiesForecasts);
        if (isMounted) {
          const favs = savedWeatherData ? Object.values(savedWeatherData) : [];
          setCitiesWeather([...favs, ...sortByCityName(citiesForecasts)]);
          setIsLoading(false);
        }
      });
      return;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    async function update() {
      try {
        const respone = await updateCitiesWeatherForecasts();
        if (respone) setCitiesWeather(respone);
      } catch (error) {
        // fail silently
      }
    }

    function visibiltyHandler() {
      if (document.visibilityState === "visible") {
        update();
      }
    }

    update();
    document.addEventListener("visibilitychange", visibiltyHandler);

    return () => {
      document.removeEventListener("visibilitychange", visibiltyHandler);
    };
  }, []);

  const transformedData = convertWeathersMeasurementUnit(citiesWeather, unit);

  return {
    loading,
    unit,
    data: transformedData,
    updateCitiesWeather: setCitiesWeather,
  };
}

export default useWeather;
