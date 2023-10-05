import { cn } from "../../../utils/helper";
import style from "./city.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { City, CurrentWeather, MeasurementUnit } from "../types";
import { convertToTimezoneLocalTime, formatToTimezoneString } from "../../../utils/time";

type CityWeatherCardProps = {
  city: City;
  tempUnit: MeasurementUnit;
  current: CurrentWeather;
  timezoneOffset: number;
  onClick?: () => void;
  onRemove?: () => void;
};

function CityWeatherCard({
  city,
  current,
  tempUnit,
  timezoneOffset,
  onClick,
  onRemove,
}: CityWeatherCardProps) {
  const date = convertToTimezoneLocalTime(current.dt, timezoneOffset);

  const formattedDate = formatToTimezoneString(date)

  return (
    <div  className={cn("card", style.card)}>
      <div onClick={onRemove} className={style.close}>
        <CloseIcon />
      </div>
      <div data-testid="city-weather-card" onClick={onClick} className={style.content}>
        <div className={style.titleSection}>
          <p className={style.location}>
            {city.name}, {city.country}
          </p>
          <p className={style.time}>{formattedDate}</p>
        </div>
        <div className={style.mainSection}>
          <div className={style.tempSection}>
            <div className={style.tempGroup}>
              <img
                className={style.weatherIcon}
                src={`/icons/${current.weather[0].icon}.png`}
              />
              <p className={style.temp}>
                {current.temp}
                <sup>°{tempUnit === "metric" ? "C" : "F"}</sup>
              </p>
            </div>
            <p className={style.desc}>{current.weather[0].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityWeatherCard;
