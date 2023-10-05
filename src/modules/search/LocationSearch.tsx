import useLocationSearch from "./useLocationSearch";
import { SearchInput } from "./SearchInput";
import { getLocationDisplayText } from "./api";
import { useNavigate } from "react-router";
import { LocationGeoInfo } from "./types";

function LocationSearch() {
  const { inputValue, suggestions, handleChange, handleSelectLocation } =
    useLocationSearch();

  const navigate = useNavigate();

  const handleLocationSelected = (location: LocationGeoInfo) => {
    navigate(`/city/${location.geonameId}`, {
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
      optionKey="geonameId"
      emptySuggestionText="No Location found"
    />
  );
}

export default LocationSearch;
