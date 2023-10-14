import { Navigate, useParams } from "react-router";
import CurrentWeatherCard from "../modules/weather/current-weather";
import DailyForecast from "../modules/weather/forecasts/DailyForecast";
import HourlyForecast from "../modules/weather/forecasts/HourlyForecasts";
import Note, { NoteCard } from "../modules/notes";
import Loading from "../layout/Loading";
import Alert from "../modules/shared/Alert";
import { useState } from "react";
import usePlaceWeather from "../modules/weather/hooks/usePlaceWeather";

const ForecastPage = ({ placeId }: { placeId: number }) => {
  const { weather, isBookmarked, isLoading, toggleSavePlace } =
    usePlaceWeather(placeId);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const removeFromFavorites = () => {};

  const handleToggleFavorite = () => {
    toggleSavePlace();
  };

  if (isLoading || !weather) {
    return <Loading />;
  }

  return (
    <div className="stack-space-2">
      <CurrentWeatherCard
        title="Current Weather"
        place={weather.place}
        weather={weather.current}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isBookmarked}
        showFavoriteButton={true}
      />
      <HourlyForecast forecasts={weather.hourly} />
      <DailyForecast forecasts={weather.daily} />
      <NoteCard>
        {!isBookmarked && (
          <div>
            Only favourite cities can have notes. To add a Note, add this city
            to your favourites.
          </div>
        )}
        {isBookmarked && <Note groupId={weather.place.id} />}
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
};

function CityFullForecastDetails() {
  const { id } = useParams();

  const placeId = parseInt(id as string);

  if (isNaN(placeId)) {
    return <Navigate to="/404" />;
  }

  return <ForecastPage placeId={placeId} />;
}

export default CityFullForecastDetails;
