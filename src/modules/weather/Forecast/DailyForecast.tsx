import { Fragment } from "react";
import { getDayName } from "../../../utils/time";
import { FormattedPlaceDailyForecast } from "../types";
import ForecastCard, { ForecastItem } from "./ForecastCard";

interface DailyForecastProps {
  forecasts: FormattedPlaceDailyForecast[];
}

function DailyForecast(props: DailyForecastProps) {
  const { forecasts } = props;

  return (
    <ForecastCard title="Daily Forecast">
      {forecasts.slice(0, 7).map((forecast, index) => (
        <Fragment key={forecast.time.getTime()}>
          {index !== 0 && <hr className="divider-vertical" />}
          <ForecastItem
            title={getDayName(forecast.time)}
            icon={forecast.weathercode}
            temp1={`${forecast.temp.min}°`}
            temp2={`${forecast.temp.max}°`}
            description={forecast.description}
          />
        </Fragment>
      ))}
    </ForecastCard>
  );
}

export default DailyForecast;
