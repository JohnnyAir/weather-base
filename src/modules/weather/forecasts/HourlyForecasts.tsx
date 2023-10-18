import { Fragment } from "react";
import { PlaceHourlyForecastWithUnit } from "../types";
import ForecastCard, { ForecastItem } from "./ForecastCard";
import { formatHoursTo12 } from "../../../utils/time";

interface HourlyForecastProps {
  forecasts: PlaceHourlyForecastWithUnit[];
}

const HourlyForecast = ({ forecasts }: HourlyForecastProps) => {
  return (
    <ForecastCard title="Hourly Forecast">
      {forecasts.slice(0, 8).map((forecast, index) => {
        return (
          <Fragment key={forecast.time.getTime()}>
            {index !== 0 && <hr className="divider-vertical" />}
            <ForecastItem
              icon={forecast.weathercode}
              title={formatHoursTo12(forecast.time)}
              temp1={`${forecast.temp}°`}
              description={forecast.description}
            />
          </Fragment>
        );
      })}
    </ForecastCard>
  );
};

export default HourlyForecast;
