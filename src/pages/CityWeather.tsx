import { useParams } from "react-router";
import useCityWeather from "../modules/weather/hooks/useCityWeather";
import CurrentWeatherCard from "../modules/weather/CurrentWeatherCard";
import DailyForecast from "../modules/weather/Forecast/DailyForecast";
import HourlyForecast from "../modules/weather/Forecast/HourlyForecasts";
import Note, { NoteCard } from "../modules/notes";
import Loading from "../layout/Loading";
import {
  deleteCityStoredWeatherAndForecasts,
  saveCityWeatherAndForecasts,
} from "../modules/weather/functions";
import Alert from "../modules/shared/Alert";
import { useState } from "react";
import { groupHasNote } from "../modules/notes/functions";
import { convertWeatherMeasurementUnit } from "../modules/weather/data";

function CityFullForecastDetails() {
  const { id } = useParams();

  const { unit, forecasts, isLoading, showFavoriteButton, updateCity } =
    useCityWeather(id as string);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  if (isLoading || !forecasts) {
    return <Loading />;
  }

  const {
    geonameId,
    current,
    city,
    is_favorite,
    timezone_offset,
    hourly,
    daily,
  } = convertWeatherMeasurementUnit(forecasts, unit);

  const removeFromFavorites = () => {
    deleteCityStoredWeatherAndForecasts(forecasts.geonameId);
    updateCity({ ...forecasts, is_favorite: false });
    setShowDeleteAlert(false);
  };

  const handleToggleFavorite = () => {
    if (forecasts.is_favorite) {
      if (groupHasNote(forecasts.geonameId)) setShowDeleteAlert(true);
      else removeFromFavorites();
    } else {
      const update = { ...forecasts, is_favorite: true };
      saveCityWeatherAndForecasts(update);
      updateCity(update);
    }
  };

  const disableNotes = !showFavoriteButton
    ? showFavoriteButton
    : !forecasts.is_favorite;
  return (
    <div className="stack-space-2">
      <CurrentWeatherCard
        title="Current Weather"
        {...current}
        city={city}
        unit={unit}
        timezoneOffset={timezone_offset}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={is_favorite}
        showFavoriteButton={showFavoriteButton}
      />
      <HourlyForecast forecasts={hourly} timezoneOffset={timezone_offset} />
      <DailyForecast forecasts={daily} timezoneOffset={timezone_offset} />
      <NoteCard>
        {disableNotes && (
          <div>
            Only favourite cities can have notes. To add a Note, add this city
            to your favourites.
          </div>
        )}
        {!disableNotes && <Note groupId={geonameId} />}
      </NoteCard>
      {showDeleteAlert && (
        <Alert
          message="Removing this city from favorites will delete all notes added to this city. Continue?"
          confirmText="Delete"
          onConfirm={removeFromFavorites}
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
    </div>
  );
}

export default CityFullForecastDetails;
