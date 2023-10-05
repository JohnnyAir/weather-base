import { useEffect, useState } from "react";
import { apiFetchCityWeatherForecast } from "../api";
import {
  tryGetCityStoredWeatherAndForecasts,
  updateCityWeatherAndForecasts,
} from "../functions";
import { CityWeatherAndForecast, MeasurementUnitState } from "../types";
import { useLocation, useNavigate, useOutletContext } from "react-router";

function useCityWeather(cityId: number | string) {
  const savedForecast = tryGetCityStoredWeatherAndForecasts(cityId);
  const { unit } = useOutletContext<MeasurementUnitState>();
  const [forecasts, setForecasts] = useState<CityWeatherAndForecast | null>(
    savedForecast
  );
  const [isLoading, setIsLoading] = useState(!forecasts);
  const [showFavoriteButton, setShowFavoriteButton] = useState(!forecasts);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadWeather() {
      setIsLoading(true);
      try {
        const forecast = await apiFetchCityWeatherForecast(
          cityId,
          location.state?.city
        );

        setForecasts(forecast);
        setIsLoading(false);
      } catch (e: any) {
        navigate("/404");
      }
    }

    const savedData = tryGetCityStoredWeatherAndForecasts(cityId);
    if (savedData) {
      console.log(savedData);
      setShowFavoriteButton(
        (savedData.isCurrentLocation && !savedData.is_favorite) || false
      );
      setForecasts(savedData);
    }

    if (!savedData) {
      loadWeather();
      setShowFavoriteButton(true);
    }
  }, [cityId, location]);

  useEffect(() => {
    const update = () => {
      if (document.visibilityState === "visible") {
        updateCityWeatherAndForecasts(Number(cityId)).then(
          (data) => data && setForecasts(data)
        );
      }
    };

    update();
    document.addEventListener("visibilitychange", update);

    return () => {
      document.removeEventListener("visibilitychange", update);
    };
  }, [cityId]);

  return {
    unit,
    forecasts,
    isLoading,
    showFavoriteButton,
    updateCity: setForecasts,
  };
}

export default useCityWeather;
