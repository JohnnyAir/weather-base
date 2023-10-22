import { useState } from "react";
import { useBookmarkedPlacesWeather } from "../hooks/useBookmarkedPlacesWeather";
import WeatherCard from "./WeatherCard";
import style from "./bookmark.module.css";
import { useNavigate } from "react-router";
import Alert from "../../shared/Alert";
import Loading from "../../../layout/Loading";
import { GeoPlace } from "../../place/types";
import { routes } from "../../../router";

const BookmarkedList = () => {
  const { weathers, isLoading, removeFromBookmarks } =
    useBookmarkedPlacesWeather();
  const [placeToBeRemoved, setPlaceToBeRemoved] = useState<GeoPlace | null>(
    null
  );

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  const handleViewPlaceForecast = (place: GeoPlace) => {
    navigate(routes.place.url(place.id));
  };

  const handleRemoveFromBookmarks = () => {
    if (placeToBeRemoved) {
      removeFromBookmarks(placeToBeRemoved.id);
      setPlaceToBeRemoved(null);
    }
  };

  return (
    <>
      <div className={style.cityList}>
        {weathers.map(({ place, weather }) => (
          <WeatherCard
            key={place.id}
            current={weather.current}
            place={place}
            onClick={() => handleViewPlaceForecast(place)}
            onRemove={() => setPlaceToBeRemoved(place)}
          />
        ))}
      </div>
      {weathers.length === 0 && (
        <div className={style.noCitySaved}>
          No Saved Place, Places added as favorites will appear here. Use the
          search bar to find places.
        </div>
      )}
      {placeToBeRemoved ? (
        <Alert
          message={`Removing ${placeToBeRemoved.name} from bookmarks will also delete all notes added to this place. Are you sure you want to continue?`}
          confirmText="Remove"
          onConfirm={handleRemoveFromBookmarks}
          onClose={() => setPlaceToBeRemoved(null)}
        />
      ) : null}
    </>
  );
};

export default BookmarkedList;
