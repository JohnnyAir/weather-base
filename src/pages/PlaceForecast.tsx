import { Navigate, useParams } from "react-router";
import CurrentWeatherCard from "../modules/weather/CurrentWeatherCard";
import DailyForecast from "../modules/weather/Forecast/DailyForecast";
import HourlyForecast from "../modules/weather/Forecast/HourlyForecasts";
import Note, { NoteCard } from "../modules/notes";
import Loading from "../layout/Loading";
import Alert from "../modules/shared/Alert";
import { useState } from "react";
import usePlaceForecast from "../modules/weather/hooks/usePlaceForecast";

function ForecastPage({ placeId }: { placeId: number }) {
  const { forecast, isSaved, isLoading, toggleSavePlace } =
    usePlaceForecast(placeId);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const removeFromFavorites = () => {};

  const handleToggleFavorite = () => {
    toggleSavePlace();
  };

  if (isLoading || !forecast) {
    return <Loading />;
  }

  return (
    <div className="stack-space-2">
      <CurrentWeatherCard
        title="Current Weather"
        place={forecast.place}
        weather={forecast.current}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isSaved}
        showFavoriteButton={true}
      />
      <HourlyForecast forecasts={forecast.hourly} />
      <DailyForecast forecasts={forecast.daily} />
      <NoteCard>
        {!isSaved && (
          <div>
            Only favourite cities can have notes. To add a Note, add this city
            to your favourites.
          </div>
        )}
        {isSaved && <Note groupId={forecast.place.id} />}
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

function CityFullForecastDetails() {
  const { id } = useParams();

  const placeId = parseInt(id as string);

  if (isNaN(placeId)) {
    return <Navigate to="/404" />;
  }

  return <ForecastPage placeId={placeId} />;
}

export default CityFullForecastDetails;
