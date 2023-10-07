import useLocationSearch from "./useLocationSearch";
import { SearchInput } from "./SearchInput";
import { getLocationDisplayText } from "./api/transformers";
import { useNavigate } from "react-router";
import { GeoPlace } from "./types";

function LocationSearch() {
  const { inputValue, suggestions, handleChange, handleSelectLocation } =
    useLocationSearch();

  const navigate = useNavigate();

  const handleLocationSelected = (location: GeoPlace) => {
    navigate(`/city/${location.id}`, {
      state: {
        city: location,
      },
    });
    handleSelectLocation(location);
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
