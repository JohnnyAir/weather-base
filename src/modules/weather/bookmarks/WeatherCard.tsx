import { cn } from "../../../utils/helper";
import style from "./bookmark.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { PlaceCurrentWeatherWithUnit } from "../types";
import { formatToTimezoneString } from "../../../utils/time";
import { GeoPlace } from "../../place/types";

type WeatherCardProps = {
  place: GeoPlace;
  current: PlaceCurrentWeatherWithUnit;
  onClick?: () => void;
  onRemove?: () => void;
};

const WeatherCard = ({
  current,
  place,
  onClick,
  onRemove,
}: WeatherCardProps) => {
  const formattedDate = formatToTimezoneString(current.time);

  return (
    <div className={cn("card", style.card)}>
      <div onClick={onRemove} className={style.close}>
        <CloseIcon />
      </div>
      <div
        data-testid="city-weather-card"
        onClick={onClick}
        className={style.content}
      >
        <div className={style.titleSection}>
          <p className={style.location}>
            {place.name}, {place.countryName}
          </p>
          <p className={style.time}>{formattedDate}</p>
        </div>
        <div className={style.mainSection}>
          <div className={style.tempSection}>
            <div className={style.tempGroup}>
              <img
                className={style.weatherIcon}
                src={`/icons/${current.weathercode}.png`}
                alt={current.description}
              />
              <p className={style.temp}>
                {current.temp}
                <sup>{current.temp_unit}</sup>
              </p>
            </div>
            <p className={style.desc}>{current.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
