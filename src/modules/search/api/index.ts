import { apiFetchLocationPredictions, findNearbyPlaceName } from "./api";
import { normalizeGeoPlaces } from "./transformers";

export const getPlaceSuggestions = async (searchText: string) => {
  const response = await apiFetchLocationPredictions(searchText);
  return normalizeGeoPlaces(response);
};

export const getPlacefromGeoCoords = async (
  lat: string | number,
  lng: string | number
) => {
  const response = await findNearbyPlaceName(lat, lng);
  return normalizeGeoPlaces(response);
};
