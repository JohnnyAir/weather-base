import CurrentWeatherCard from ".";
import { useMyLocationWeather } from "../hooks/useMyLocationWeather";
import { ReactComponent as DoubleRightArrow } from "../../../assets/icons/double-arrow-right-icon.svg";
import { cn } from "../../../utils/helper";
import style from "./current-weather.module.css";
import { useNavigate } from "react-router-dom";

const MyLocation = () => {
  const { weather, isLoading } = useMyLocationWeather();
  const navigate = useNavigate();

  if (!weather || isLoading) {
    return null;
  }

  const seeFullForecast = () => {
    navigate(`/city/${weather.place.id}`);
  };

  return (
    <CurrentWeatherCard
      title="My Location"
      place={weather.place}
      weather={weather.current}
      cta={
        <button
          onClick={seeFullForecast}
          className={cn(style.seeMore, "button", "primary")}
        >
          <span>See Full Forecast</span>
          <span className={style.seeMoreIcon}>
            <DoubleRightArrow />
          </span>
        </button>
      }
    />
  );
};

export default MyLocation;
