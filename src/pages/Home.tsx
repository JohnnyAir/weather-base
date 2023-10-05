import { useRef, useState } from "react";
import Alert from "../modules/shared/Alert";
import CitiesWeatherList from "../modules/weather/CityWeatherCard/CitiesWeatherList";
import MyLocation from "../modules/weather/CurrentWeatherCard/MyLocation";
import { deleteCityStoredWeatherAndForecasts } from "../modules/weather/functions";
import useWeather from "../modules/weather/hooks/useWeather";
import Loading from "../layout/Loading";
import { groupHasNote } from "../modules/notes/functions";

function MainPage() {
  const { data, unit, loading, updateCitiesWeather } = useWeather();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const alertConfirmAction = useRef<() => void>();

  if (loading) {
    return <Loading />;
  }

  const removeCity = (geonameId: number) => {
    deleteCityStoredWeatherAndForecasts(geonameId);
    updateCitiesWeather((prev) =>
      [...(prev || [])].filter((city) => city.geonameId !== geonameId)
    );
    setShowDeleteAlert(false);
  };

  const handleRemoveCity = (geonameId: number) => {
    if (groupHasNote(geonameId)) {
      alertConfirmAction.current = () => removeCity(geonameId);
      setShowDeleteAlert(true);
    } else {
      removeCity(geonameId);
    }
  };

  return (
    <div className="stack-space-2">
      <MyLocation />
      {data && (
        <>
          <CitiesWeatherList
            unit={unit}
            citiesWeather={data}
            handleRemoveCity={handleRemoveCity}
            listTitle="Cities"
          />
        </>
      )}
      {showDeleteAlert ? (
        <Alert
          message="Removing this city from favorites will delete all notes added to this city. Continue?"
          confirmText="Delete"
          onConfirm={alertConfirmAction.current}
          onClose={() => setShowDeleteAlert(false)}
        />
      ) : null}
    </div>
  );
}

export default MainPage;
