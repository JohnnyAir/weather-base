import { Fragment } from "react";
import { convertToTimezoneLocalTime, getDayName } from "../../../utils/time";
import { Daily } from "../types";
import ForecastCard, { ForecastItem } from "./ForecastCard";

interface DailyForecastProps {
  forecasts: Daily[];
  timezoneOffset: number;
}

function DailyForecast(props: DailyForecastProps) {
  const { forecasts, timezoneOffset } = props;

  return (
    <ForecastCard title="Daily Forecast">
      {forecasts.slice(0, 7).map((forecast, index) => (
        <Fragment key={forecast.dt}>
          {index !== 0 && <hr className="divider-vertical" />}
          <ForecastItem
            title={getDayName(
              convertToTimezoneLocalTime(forecast.dt, timezoneOffset)
            )}
            icon={forecast.weather[0].icon}
            temp1={`${forecast.temp.day}°`}
            temp2={`${forecast.temp.night}°`}
            description={forecast.weather[0].description}
          />
        </Fragment>
      ))}
    </ForecastCard>
  );
}

export default DailyForecast;
