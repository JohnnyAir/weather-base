import CurrentWeatherCard from ".";
import { useCurrentLocationWeather } from "../hooks/useCurrentLocationWeather";
import { ReactComponent as DoubleRightArrow } from "../../../assets/icons/double-arrow-right-icon.svg";
import { cn } from "../../../utils/helper";
import style from "./current-weather.module.css";
import { useNavigate } from "react-router-dom";

function MyLocation() {
  const { forecast, isLoading } = useCurrentLocationWeather();
  const navigate = useNavigate();

  if (!forecast || isLoading) {
    return null;
  }

  const seeFullForecast = () => {
    navigate(`/city/${forecast.place.id}`);
  };

  return (
    <CurrentWeatherCard
      title="My Location"
      unit="metric"
      place={forecast.place}
      weather={forecast.current}
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
