import {
  CityWeatherAndForecast,
  CurrentWeather,
  MeasurementUnit,
} from "./types";

export function celsiusToFahrenheit(celsius: number) {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return Number(fahrenheit.toFixed(2));
}

export function millimeterToInches(mmPerHour: number) {
  const inchesPerHour = mmPerHour * 0.0393701;
  return Number(inchesPerHour.toFixed(2));
}

export function metersToMiles(meters: number) {
  const miles = meters * 0.000621371;
  return Number(miles.toFixed(2));
}

function metersPerSecToMilesPerHour(metersPerSec: number) {
  const milesPerHour = metersPerSec * 2.23694;
  return milesPerHour;
}

export function convertWeatherMeasurementUnit(
  weatherData: CityWeatherAndForecast,
  unit: MeasurementUnit
) {
  if (unit === "metric") {
    return weatherData;
  }

  const weather: CityWeatherAndForecast = JSON.parse(
    JSON.stringify(weatherData)
  );

  const currentWeather: CurrentWeather = {
    ...weather.current,
    temp: celsiusToFahrenheit(weather.current.temp),
    feels_like: celsiusToFahrenheit(weather.current.temp),
    wind_speed: metersPerSecToMilesPerHour(weather.current.wind_speed),
    visibility: metersToMiles(weather.current.visibility),
  };

  if (currentWeather.rain) {
    currentWeather.rain["1h"] = millimeterToInches(currentWeather.rain["1h"]);
  }

  const hourly = weather.hourly.map((data) => ({
    ...data,
    temp: celsiusToFahrenheit(data.temp),
    feels_like: celsiusToFahrenheit(data.temp),
  }));

  const daily = weather.daily.map((data) => ({
    ...data,
    temp: {
      day: celsiusToFahrenheit(data.temp.day),
      min: celsiusToFahrenheit(data.temp.min),
      max: celsiusToFahrenheit(data.temp.max),
      night: celsiusToFahrenheit(data.temp.night),
      eve: celsiusToFahrenheit(data.temp.eve),
      morn: celsiusToFahrenheit(data.temp.morn),
    },
    feels_like: {
      day: celsiusToFahrenheit(data.temp.day),
      night: celsiusToFahrenheit(data.temp.night),
      eve: celsiusToFahrenheit(data.temp.eve),
      morn: celsiusToFahrenheit(data.temp.morn),
    },
  }));

  return { ...weather, hourly, daily, current: currentWeather };
}

export function convertWeathersMeasurementUnit(
  weatherData: CityWeatherAndForecast[] | null,
  unit: MeasurementUnit
) {
  if (!weatherData) {
    return null;
  }

  if (unit === "metric") {
    return weatherData;
  }
  return weatherData.map((w) => convertWeatherMeasurementUnit(w, unit));
}
