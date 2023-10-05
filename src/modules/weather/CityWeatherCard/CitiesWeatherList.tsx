import { CityWeatherAndForecast, MeasurementUnit } from "../types";
import CityWeatherCard from "./index";
import style from "./city.module.css";
import { useNavigate } from "react-router";

interface CitiesWeatherListProps {
  citiesWeather: Pick<
    CityWeatherAndForecast,
    "current" | "city" | "timezone_offset" | "geonameId"
  >[];
  unit: MeasurementUnit;
  listTitle: string;
  handleRemoveCity?: (id: number) => void;
}

function CitiesWeatherList(props: CitiesWeatherListProps) {
  const { citiesWeather, unit, handleRemoveCity } = props;
  const navigate = useNavigate();

  const handleViewCityForecast = (geonameId: number) => {
    navigate(`/city/${geonameId}`);
  };

  return (
    <>
      <h4 className={style.sectionTitle}>Cities</h4>
      <div className={style.cityList}>
        {citiesWeather.map(({ timezone_offset, geonameId, city, current }) => (
          <CityWeatherCard
            key={geonameId}
            tempUnit={unit}
            current={current}
            city={city}
            timezoneOffset={timezone_offset}
            onClick={() => handleViewCityForecast(geonameId)}
            onRemove={() => handleRemoveCity?.(geonameId)}
          />
        ))}
      </div>
      {citiesWeather.length === 0 && (
        <div className={style.noCitySaved}>
          No Saved Cities, cities added as favorites will appear here. Use the
          search bar to find cities.
        </div>
      )}
    </>
  );
}

export default CitiesWeatherList;
