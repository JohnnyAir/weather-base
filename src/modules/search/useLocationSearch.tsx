import { ChangeEventHandler, useEffect, useState } from "react";
import { debounce } from "../../utils/helper";
import { fetchLocationPredictions, getLocationDisplayText } from "./api";
import { GeonameLocationSearchResult, LocationGeoInfo } from "./types";

const fetchLocations = debounce(
  (location: string, cb: (response: GeonameLocationSearchResult) => void) => {
    fetchLocationPredictions(location).then(cb);
  },
  250
);

const MAX_SUGGESTED_LOCATIONS = 8;

const useLocationSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationGeoInfo[] | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] =
    useState<LocationGeoInfo | null>();

  useEffect(() => {
    if (
      selectedLocation &&
      getLocationDisplayText(selectedLocation) === inputValue
    ) {
      return;
    }

    if (!inputValue) {
      setSuggestions(null);
      return;
    }

    if (inputValue.length > 1) {
      fetchLocations(inputValue, (response) => {
        const newSuggestions = response.geonames.slice(
          0,
          MAX_SUGGESTED_LOCATIONS
        );
        setSuggestions(newSuggestions);
      });
    }
  }, [inputValue]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSelectLocation = (location: LocationGeoInfo) => {
    setInputValue(getLocationDisplayText(location));
    setSelectedLocation(location);
    setSuggestions(null);
  };

  return {
    inputValue,
    suggestions,
    handleChange,
    handleSelectLocation,
  };
};

export default useLocationSearch;
