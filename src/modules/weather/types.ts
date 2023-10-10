import { GeoPlace } from "../search/types";

export interface CurrentAndForecastApiResponse {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: Hourly[];
  daily: Daily[];
  alerts?: WeatherAlert[];
}

export interface Daily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: Temp;
  feels_like: Feelslike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
}

export interface Feelslike {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export interface Temp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export interface Hourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  pop: number;
  rain?: Rain;
  snow?: Rain;
}

export interface Rain {
  "1h": number;
  "3h": number;
}

export interface Snow {
  "1h": number;
  "3h": number;
}

export interface CurrentWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: Weather[];
  rain?: Rain;
  snow?: Snow;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

/**
 * @deprecated To be removed
 */
export interface City {
  name: string;
  country: string;
}

/**
 * @deprecated To be removed
 */
export interface CityWeatherAndForecast extends CurrentAndForecastApiResponse {
  geonameId: number;
  city: City;
  is_favorite?: boolean;
  isCurrentLocation?: boolean;
  lastUpdateTime: number;
}

/**
 * @deprecated To be removed
 */
export interface SavedWeathers {
  [index: number | string]: CityWeatherAndForecast;
}

/**
 * @deprecated To be removed
 */
export type HashedCityInfo = {
  geonameId: number;
  lat: string;
  lng: string;
};

export type MeasurementUnit = "metric" | "imperial";

export type MeasurementUnitState = { unit: MeasurementUnit };

export type PlaceForecastGeoData = GeoPlace & {
  timezone: string;
  timezone_offset: number;
};

export type PlaceCurrentWeather = {
  time: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  uvi: number;
  visibility: number;
  wind_speed: number;
  weathercode: string;
  description: string;
};

export type PlaceHourlyForecast = PlaceCurrentWeather;

export type PlaceDailyForecast = {
  time: number;
  temp: {
    min: number;
    max: number;
  };
  feels_like: {
    min: number;
    max: number;
  };
  pressure: number;
  humidity: number;
  uvi: number;
  wind_speed: number;
  weathercode: string;
  description: string;
};

export type PlaceWeatherAlert = {
  event: string;
  start: number;
  end: number;
  description: string;
};

export type PlaceForecast = {
  place: PlaceForecastGeoData;
  current: PlaceCurrentWeather;
  hourly: PlaceHourlyForecast[];
  daily: PlaceDailyForecast[];
  alerts?: PlaceWeatherAlert[];
  meta?: { [index: string]: any };
};

export type FormattedPlaceCurrentWeather = {
  time: Date;
  temp_unit: string;
  temp: number;
  feels_like: number;
  pressure: string;
  humidity: string;
  uvi: string;
  visibility: string;
  wind_speed: string;
  weathercode: string;
  description: string;
};

export type FormattedPlaceHourlyForecast = FormattedPlaceCurrentWeather;

export type FormattedPlaceDailyForecast = {
  time: Date;
  temp_unit: string;
  temp: {
    min: number;
    max: number;
  };
  feels_like: {
    min: number;
    max: number;
  };
  pressure: string;
  humidity: string;
  uvi: string;
  wind_speed: string;
  weathercode: string;
  description: string;
};

export type FormattedPlaceForecast = {
  place: PlaceForecastGeoData;
  current: FormattedPlaceCurrentWeather;
  hourly: FormattedPlaceHourlyForecast[];
  daily: FormattedPlaceDailyForecast[];
  alerts?: PlaceWeatherAlert[];
  meta?: { [index: string]: any };
};

export type SavedPlaces = { [k: string]: GeoPlace };
