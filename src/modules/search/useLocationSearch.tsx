import { ChangeEventHandler, useState } from "react";
import { getPlaceSuggestions } from "./api";
import { GeoPlace } from "./types";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "../../utils/hooks";
import { getLocationDisplayText } from "./api/transformers";
import { MS_TIME } from "../../client/constant";

const useLocationSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const searchText = useDebounce(inputValue, 100);
  const [selectedLocation, setSelectedLocation] = useState<GeoPlace | null>();

  const inputValueIsSelectedLocation =
    selectedLocation && getLocationDisplayText(selectedLocation) === inputValue;

  const {
    isLoading,
    isError,
    data: suggestions,
    error,
    status,
  } = useQuery<GeoPlace[] | null>(
    ["search", searchText],
    () => getPlaceSuggestions(searchText),
    {
      placeholderData: null,
      enabled: searchText.length > 1 && !inputValueIsSelectedLocation,
      refetchOnWindowFocus: false,
      staleTime: MS_TIME.TEN_SECONDS,
      cacheTime: MS_TIME.TEN_SECONDS,
      // keepPreviousData: true,
    }
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSelectLocation = (location: GeoPlace) => {
    setInputValue(getLocationDisplayText(location));
    setSelectedLocation(location);
  };

  return {
    error,
    status,
    isLoading,
    isError,
    inputValue,
    suggestions,
    selectedLocation,
    handleChange,
    handleSelectLocation,
  };
};

export default useLocationSearch;
