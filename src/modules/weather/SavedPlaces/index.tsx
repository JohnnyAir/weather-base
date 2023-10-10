import { useState } from "react";
import useSavedPlacesForecasts from "../hooks/useSavedPlacesForecasts";
import WeatherCard from "./WeatherCard";
import style from "./city.module.css";
import { useNavigate } from "react-router";
import Alert from "../../shared/Alert";
import Loading from "../../../layout/Loading";
import { removePlace, setPlace } from "../store";
import { GeoPlace } from "../../search/types";

function SavedPlaces() {
  const { forecasts, isLoading } = useSavedPlacesForecasts();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  const handleViewPlaceForecast = (place: GeoPlace) => {
    setPlace(place);
    navigate(`/city/${place.id}`);
  };

  return (
    <>
      <h4 className={style.sectionTitle}>Saved Locations</h4>
      <div className={style.cityList}>
        {forecasts.map(({ place, current }) => (
          <WeatherCard
            key={place.id}
            current={current}
            place={place}
            onClick={() => handleViewPlaceForecast(place)}
            onRemove={() => removePlace(place)}
          />
        ))}
      </div>
      {forecasts.length === 0 && (
        <div className={style.noCitySaved}>
          No Saved Location, Location added as favorites will appear here. Use
          the search bar to find places.
        </div>
      )}
      {showDeleteAlert ? (
        <Alert
          message="Removing this city from favorites will delete all notes added to this city. Continue?"
          confirmText="Delete"
          onConfirm={() => {}}
          onClose={() => setShowDeleteAlert(false)}
        />
      ) : null}
    </>
  );
}

export default SavedPlaces;
