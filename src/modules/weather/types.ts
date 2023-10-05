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

export interface City {
  name: string;
  country: string;
}

export interface CityWeatherAndForecast extends CurrentAndForecastApiResponse {
  geonameId: number;
  city: City;
  is_favorite?: boolean;
  isCurrentLocation?: boolean;
  lastUpdateTime: number;
}

export interface SavedWeathers {
  [index: number | string]: CityWeatherAndForecast;
}

export type HashedCityInfo = {
  geonameId: number;
  lat: string;
  lng: string;
};

export type MeasurementUnit = "metric" | "imperial";

export type MeasurementUnitState = { unit: MeasurementUnit };
