import { convertToTimezoneLocalTime } from "../../../utils/time";
import { GeoPlace } from "../../search/types";
import {
  CurrentAndForecastApiResponse,
  PlaceDailyForecastWithUnit,
  PlaceWeatherInfoWithUnit,
  PlaceHourlyForecastWithUnit,
  PlaceWeather,
} from "../types";
import { MeasurementUnit } from "../types";

export const normalizeWeatherForecast = (
  place: GeoPlace,
  forecast: CurrentAndForecastApiResponse
): PlaceWeather => {
  const normalizedForecast: PlaceWeather = {
    place: {
      ...place,
      timezone: forecast.timezone,
      timezone_offset: forecast.timezone_offset,
    },
    current: {
      time: forecast.current.dt,
      temp: forecast.current.temp,
      feels_like: forecast.current.feels_like,
      wind_speed: forecast.current.wind_speed,
      pressure: forecast.current.pressure,
      visibility: forecast.current.visibility,
      humidity: forecast.current.humidity,
      uvi: forecast.current.uvi,
      weathercode: forecast.current.weather[0].icon,
      description: forecast.current.weather[0].description,
    },
    hourly: forecast.hourly.slice(0, 20).map((h) => ({
      time: h.dt,
      temp: h.temp,
      feels_like: h.feels_like,
      wind_speed: h.wind_speed,
      pressure: h.pressure,
      visibility: h.visibility,
      humidity: h.humidity,
      uvi: h.uvi,
      weathercode: h.weather[0].icon,
      description: h.weather[0].description,
    })),
    daily: forecast.daily.map((d) => ({
      time: d.dt,
      temp: {
        min: d.temp.min,
        max: d.temp.max,
      },
      feels_like: {
        min: d.feels_like.day,
        max: d.feels_like.night,
      },
      wind_speed: d.wind_speed,
      pressure: d.pressure,
      humidity: d.humidity,
      uvi: d.uvi,
      weathercode: d.weather[0].icon,
      description: d.weather[0].description,
    })),
    alerts: forecast.alerts,
  };

  return normalizedForecast;
};

export const celsiusToFahrenheit = (celsius: number) => {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return Number(fahrenheit.toFixed(2));
};

export const millimeterToInches = (mmPerHour: number) => {
  const inchesPerHour = mmPerHour * 0.0393701;
  return Number(inchesPerHour.toFixed(2));
};

export const metersToMiles = (meters: number) => {
  const miles = meters * 0.000621371;
  return Number(miles.toFixed(2));
};

export const metersPerSecToMilesPerHour = (metersPerSec: number) => {
  const milesPerHour = metersPerSec * 2.23694;
  return milesPerHour;
};

export const applyMetricUnitFormatting = (
  forecast: PlaceWeather
): PlaceWeatherInfoWithUnit => {
  const cW = forecast.current;

  const current: PlaceWeatherInfoWithUnit["current"] = {
    ...cW,
    time: convertToTimezoneLocalTime(cW.time, forecast.place.timezone_offset),
    temp_unit: "°C",
    wind_speed: `${(cW.wind_speed * 3.6).toFixed(2)}kph`,
    visibility: `${cW.visibility / 1000}Km`,
    pressure: `${cW.pressure}hPa`,
    humidity: `${cW.humidity}%`,
    uvi: `${cW.uvi}`,
  };

  const hourly: PlaceHourlyForecastWithUnit[] = forecast.hourly.map((data) => ({
    ...data,
    time: convertToTimezoneLocalTime(data.time, forecast.place.timezone_offset),
    temp_unit: "°C",
    wind_speed: `${(data.wind_speed * 3.6).toFixed(2)}kph`,
    visibility: `${data.visibility / 1000}Km`,
    pressure: `${data.pressure}hPa`,
    humidity: `${data.humidity}%`,
    uvi: `${data.uvi}`,
  }));

  const daily: PlaceDailyForecastWithUnit[] = forecast.daily.map((data) => ({
    ...data,
    time: convertToTimezoneLocalTime(data.time, forecast.place.timezone_offset),
    temp_unit: "°C",
    wind_speed: `${(data.wind_speed * 3.6).toFixed(2)}kph`,
    pressure: `${data.pressure}hPa`,
    humidity: `${data.humidity}%`,
    uvi: `${data.uvi}`,
  }));

  return { ...forecast, current, hourly, daily };
};

export const applyImperialUnitFormatting = (
  forecast: PlaceWeather
): PlaceWeatherInfoWithUnit => {
  const cW = forecast.current;

  const current: PlaceWeatherInfoWithUnit["current"] = {
    ...cW,
    temp_unit: "°F",
    time: convertToTimezoneLocalTime(cW.time, forecast.place.timezone_offset),
    temp: celsiusToFahrenheit(cW.temp),
    feels_like: celsiusToFahrenheit(cW.feels_like),
    wind_speed: `${metersPerSecToMilesPerHour(cW.wind_speed).toFixed(2)}mph`,
    visibility: `${metersToMiles(cW.visibility)}miles`,
    pressure: `${cW.pressure}hPa`,
    humidity: `${cW.humidity}%`,
    uvi: `${cW.uvi}`,
  };

  const hourly: PlaceHourlyForecastWithUnit[] = forecast.hourly.map((data) => ({
    ...data,
    temp_unit: "°F",
    time: convertToTimezoneLocalTime(data.time, forecast.place.timezone_offset),
    temp: celsiusToFahrenheit(data.temp),
    feels_like: celsiusToFahrenheit(data.feels_like),
    wind_speed: `${metersPerSecToMilesPerHour(data.wind_speed).toFixed(2)}mph`,
    visibility: `${metersToMiles(data.visibility)}miles`,
    pressure: `${data.pressure}hPa`,
    humidity: `${data.humidity}%`,
    uvi: `${data.uvi}`,
  }));

  const daily: PlaceDailyForecastWithUnit[] = forecast.daily.map((data) => ({
    ...data,
    temp_unit: "°F",
    time: convertToTimezoneLocalTime(data.time, forecast.place.timezone_offset),
    temp: {
      min: celsiusToFahrenheit(data.temp.min),
      max: celsiusToFahrenheit(data.temp.max),
    },
    feels_like: {
      min: celsiusToFahrenheit(data.feels_like.min),
      max: celsiusToFahrenheit(data.feels_like.max),
    },
    wind_speed: `${metersPerSecToMilesPerHour(data.wind_speed).toFixed(2)}mph`,
    pressure: `${data.pressure}hPa`,
    humidity: `${data.humidity}%`,
    uvi: `${data.uvi}`,
  }));

  return { ...forecast, current, hourly, daily };
};

export const formatWeatherDataValuesByUnit = (
  forecast: PlaceWeather,
  unit: MeasurementUnit
) => {
  switch (unit) {
    case "metric":
      return applyMetricUnitFormatting(forecast);
    case "imperial":
      return applyImperialUnitFormatting(forecast);
    default:
      throw "invalid measurement unit";
  }
};
