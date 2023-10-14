import { ReactNode } from "react";
import style from "./current-weather.module.css";
import { PlaceCurrentWeatherWithUnit, PlaceWeatherGeoData } from "../types";
import { formatToTimezoneString } from "../../../utils/time";
import { AirIcon, WaterDrop, PressureIcon, EyeIcon } from "../../shared/icons";
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

interface CurrentWeatherCardProps {
  title?: string;
  place: PlaceWeatherGeoData;
  weather: PlaceCurrentWeatherWithUnit;
  cta?: ReactNode;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const CurrentWeatherCard = (props: CurrentWeatherCardProps) => {
  const {
    title,
    place,
    weather,
    cta,
    isFavorite,
    showFavoriteButton = false,
    onToggleFavorite,
  } = props;

  const formattedDate = formatToTimezoneString(weather.time);

  const getPlaceName = () => {
    const name = [place.name];
    if (place.admin1 && place.admin1 !== place.name) {
      name.push(place.admin1);
    }
    name.push(place.countryName);
    return name.join(", ");
  };

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
            <p className={style.location}>{getPlaceName()}</p>
            <p className={style.time}>weather as at {formattedDate}</p>
            <div className={style.tempGroup}>
              <img
                className={style.weatherIcon}
                src={`/icons/${weather.weathercode}.png`}
                width={120}
                height={120}
              />
              <p className={style.temp}>
                {weather.temp}
                <sup>{weather.temp_unit}</sup>
              </p>
            </div>
            <p className={style.desc}> {weather.description}</p>
          </div>
          <div>
            <ul className={style.additionalInfoList}>
              <li className={style.additionalInfoItemNoIcon}>
                <div className="">
                  <span className="">Feels like {weather.feels_like}°</span>
                </div>
              </li>
              <AdditionalWeatherInfoItem
                value={weather.wind_speed}
                title="Wind"
                icon={<AirIcon />}
              />
              <AdditionalWeatherInfoItem
                value={weather.humidity}
                title="Humidity"
                icon={<WaterDrop />}
              />

              <AdditionalWeatherInfoItem
                value={weather.pressure}
                title="Pressure"
                icon={<PressureIcon />}
              />
              <AdditionalWeatherInfoItem
                value={weather.visibility}
                title="Visibilty"
                icon={<EyeIcon />}
              />
              {/* {weather.rain && (
                <AdditionalWeatherInfoItem
                  value={`${rain["1h"]}mm/h`}
                  title="Rain"
                  icon={<RainIcon />}
                />
              )} */}
            </ul>
            {cta}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherCard;
