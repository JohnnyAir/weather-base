import { Fragment, useMemo } from "react";
import { Hourly } from "../types";
import ForecastCard, { ForecastItem } from "./ForecastCard";
import {
  convertToTimezoneLocalTime,
  getCurrentTimeInTimeZone,
  getHourDifference,
  formatHoursTo12,
} from "../../../utils/time";

interface HourlyForecastProps {
  forecasts: Hourly[];
  timezoneOffset: number;
}

const getNext8HoursForecasts = (
  forecasts: Hourly[],
  timezoneOffset: number
) => {
  const currentTime = getCurrentTimeInTimeZone(timezoneOffset);
  let currentHourForecastIndex = forecasts.findIndex((f) => {
    const forecastTime = convertToTimezoneLocalTime(f.dt, timezoneOffset);
    return getHourDifference(currentTime, forecastTime) >= 0;
  });

  // always show 8 forecast.
  currentHourForecastIndex =
    currentHourForecastIndex > 40 ? 40 : currentHourForecastIndex;
  return forecasts.slice(
    currentHourForecastIndex,
    currentHourForecastIndex + 8
  );
};

function HourlyForecast({ forecasts, timezoneOffset }: HourlyForecastProps) {
  const next8Hoursforecast = useMemo(
    () => getNext8HoursForecasts(forecasts, timezoneOffset),
    [forecasts, timezoneOffset]
  );

  return (
    <ForecastCard title="Hourly Forecast">
      {next8Hoursforecast.slice(0, 8).map((forecast, index) => {
        const forecastTime = convertToTimezoneLocalTime(
          forecast.dt,
          timezoneOffset
        );
        return (
          <Fragment key={forecast.dt}>
            {index !== 0 && <hr className="divider-vertical" />}
            <ForecastItem
              icon={forecast.weather[0].icon}
              title={formatHoursTo12(forecastTime)}
              temp1={`${forecast.temp}°`}
              description={forecast.weather[0].description}
            />
          </Fragment>
        );
      })}
    </ForecastCard>
  );
}

export default HourlyForecast;
