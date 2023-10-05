import { ReactNode } from "react";
import style from "./current-weather.module.css";
import { City, CurrentWeather, MeasurementUnit } from "../types";
import { convertToTimezoneLocalTime, formatToTimezoneString } from "../../../utils/time";
import { ReactComponent as AirIcon } from "./icons/wind.svg";
import { ReactComponent as WaterDrop } from "./icons/water-drop.svg";
import { ReactComponent as PressureIcon } from "./icons/pressure.svg";
import { ReactComponent as EyeIcon } from "./icons/visible.svg";
import { ReactComponent as RainIcon } from "./icons/rain.svg";
import { ReactComponent as Star } from "../../../assets/icons/star-outline.svg";
import { ReactComponent as FilledStar } from "../../../assets/icons/filled-star.svg";
import { cn } from "../../../utils/helper";

const AdditionalWeatherInfoItem = ({
  icon,
  title,
  value,
}: {
  value: number | string;
  title: string;
  icon: ReactNode;
}) => {
  return (
    <li className={style.additionalInfoItem}>
      <div className={style.itemIconWrapper}>{icon}</div>
      <div className={style.additionalInfoContent}>
        <div className={style.additionalInfoGroup}>
          <p className={style.additionalInfoText}>{title}</p>
          <p className={style.additionalInfoValue}>{value}</p>
        </div>
      </div>
    </li>
  );
};

interface CurrentWeatherCardProps extends CurrentWeather {
  title?: string;
  unit: MeasurementUnit;
  timezoneOffset: number;
  city: City;
  cta?: ReactNode;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function CurrentWeatherCard(props: CurrentWeatherCardProps) {
  const {
    city,
    dt,
    unit,
    title,
    temp,
    timezoneOffset,
    wind_speed,
    humidity,
    weather,
    pressure,
    visibility,
    rain,
    feels_like,
    cta,
    isFavorite,
    showFavoriteButton = false,
    onToggleFavorite,
  } = props;

  const date = convertToTimezoneLocalTime(dt, timezoneOffset);

  const formattedDate = formatToTimezoneString(date)

  const formmatedVisibility =
    unit === "metric" ? `${visibility / 1000}Km` : `${visibility}miles`;

  const windSpeed =
    unit === "metric"
      ? `${(wind_speed * 3.6).toFixed(2)}kph`
      : `${visibility}mph`;

  return (
    <div className="card">
      <div className={style.content}>
        <div className={style.titleSection}>
          <p> {title} </p>
          {showFavoriteButton && (
            <button
              onClick={onToggleFavorite}
              className={cn(
                "button primary has-icon",
                style.favorite,
                isFavorite ? style.isFavorite : null
              )}
            >
              <span className="icon">
                {isFavorite ? <FilledStar /> : <Star />}
              </span>
              <span>{isFavorite ? "Favorite " : "Add to Favorites"}</span>
            </button>
          )}
        </div>
        <div className={style.mainSection}>
          <div className={style.tempSection}>
            <p className={style.location}>
              {city.name}, {city.country}
            </p>
            <p className={style.time}>weather as at {formattedDate}</p>
            <div className={style.tempGroup}>
              <img
                className={style.weatherIcon}
                src={`/icons/${weather[0].icon}.png`}
                width={120}
                height={120}
              />
              <p className={style.temp}>
                {temp}
                <sup>°{unit === "metric" ? "C" : "F"}</sup>
              </p>
            </div>
            <p className={style.desc}> {weather[0].description}</p>
          </div>
          <div>
            <ul className={style.additionalInfoList}>
              <li className={style.additionalInfoItemNoIcon}>
                <div className="">
                  <span className="">Feels like {feels_like}°</span>
                </div>
              </li>
              <AdditionalWeatherInfoItem
                value={windSpeed}
                title="Wind"
                icon={<AirIcon />}
              />
              <AdditionalWeatherInfoItem
                value={`${humidity}%`}
                title="Humidity"
                icon={<WaterDrop />}
              />

              <AdditionalWeatherInfoItem
                value={`${pressure}hPa`}
                title="Pressure"
                icon={<PressureIcon />}
              />
              <AdditionalWeatherInfoItem
                value={formmatedVisibility}
                title="Visibilty"
                icon={<EyeIcon />}
              />
              {rain && (
                <AdditionalWeatherInfoItem
                  value={`${rain["1h"]}mm/h`}
                  title="Rain"
                  icon={<RainIcon />}
                />
              )}
            </ul>
            {cta}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeatherCard;
