import { Navigate, useParams } from "react-router";
import CurrentWeatherCard from "../modules/weather/current-weather";
import DailyForecast from "../modules/weather/forecasts/DailyForecast";
import HourlyForecast from "../modules/weather/forecasts/HourlyForecasts";
import Note, { NoteCard } from "../modules/notes";
import Loading from "../layout/Loading";
import Alert from "../modules/shared/Alert";
import { useState } from "react";
import usePlaceWeather from "../modules/weather/hooks/usePlaceWeather";
import { ErrorBoundaryWithQueryReset } from "../modules/error/ErrorBoundary";

const PlaceWeatherAndForecast = ({ placeId }: { placeId: number }) => {
  const { data, isBookmarked, isLoading, toggleSavePlace } =
    usePlaceWeather(placeId);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleRemoveFromBookmarks = () => {
    toggleSavePlace();
    setShowDeleteAlert(false);
  };

  const handleToggleSavePlace = () => {
    if (!isBookmarked) {
      toggleSavePlace();
      return;
    }
    setShowDeleteAlert(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  //handled by error-boundary
  if (!data) return null;

  const { weather, place } = data;

  return (
    <div className="stack-space-2">
      <CurrentWeatherCard
        title="Current Weather"
        place={place}
        weather={weather.current}
        isBookmarked={isBookmarked}
        onToggleSave={handleToggleSavePlace}
        showBookmarkButton={true}
      />
      <HourlyForecast forecasts={weather.hourly} />
      <DailyForecast forecasts={weather.daily} />
      <NoteCard>
        {!isBookmarked && (
          <div>To add Notes, add this city to your bookmarks.</div>
        )}
        {isBookmarked && <Note groupId={weather.placeId} />}
      </NoteCard>
      {showDeleteAlert && (
        <Alert
          message={`Removing ${place.name} from bookmarks will also delete all notes added to this place. Are you sure you want to continue?`}
          confirmText="Remove"
          onConfirm={handleRemoveFromBookmarks}
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
    </div>
  );
};

function PlaceWeatherAndForecastPage() {
  const { id } = useParams();

  const placeId = parseInt(id as string);

  if (isNaN(placeId)) {
    return <Navigate to="/404" />;
  }

  return (
    <ErrorBoundaryWithQueryReset>
      <PlaceWeatherAndForecast placeId={placeId} />
    </ErrorBoundaryWithQueryReset>
  );
}

export default PlaceWeatherAndForecastPage;
