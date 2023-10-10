import useLocationSearch from "./useLocationSearch";
import { SearchInput } from "./SearchInput";
import { getLocationDisplayText } from "./api/transformers";
import { useNavigate } from "react-router";
import { GeoPlace } from "./types";
import { setPlace } from "../weather/store";

function LocationSearch() {
  const { inputValue, suggestions, handleChange, handleSelectLocation } =
    useLocationSearch();

  const navigate = useNavigate();

  const handleLocationSelected = (location: GeoPlace) => {
    handleSelectLocation(location);
    setPlace(location);
    navigate(`/city/${location.id}`, {
      state: {
        city: location,
      },
    });
  };

  return (
    <SearchInput
      placeholder="Search city ..."
      value={inputValue}
      suggestions={suggestions}
      getSuggestionsText={getLocationDisplayText}
      onChange={handleChange}
      onSuggestionSelected={handleLocationSelected}
      optionKey="id"
      emptySuggestionText="No Location found"
    />
  );
}

export default LocationSearch;
