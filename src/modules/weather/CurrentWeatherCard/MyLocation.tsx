import CurrentWeatherCard from ".";
import { useCurrentLocationWeather } from "../hooks/useCurrentLocationWeather";
import { ReactComponent as DoubleRightArrow } from "../../../assets/icons/double-arrow-right-icon.svg";
import { cn } from "../../../utils/helper";
import style from "./current-weather.module.css";
import { useNavigate } from "react-router-dom";

function MyLocation() {
  const { unit, currentCityForecast } = useCurrentLocationWeather();
  const navigate = useNavigate();

  if (!currentCityForecast) {
    return null;
  }

  const seeFullForecast = () => {
    navigate(`/city/${currentCityForecast.geonameId}`);
  };

  return (
    <CurrentWeatherCard
      title="My Location"
      unit={unit}
      timezoneOffset={currentCityForecast.timezone_offset}
      {...currentCityForecast.current}
      city={currentCityForecast.city}
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
}

export default MyLocation;
