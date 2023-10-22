import {
  apiFetchLocationPredictions,
  apiFetchPlaceById,
  findNearbyPlaceName,
} from "./api";
import { normalizeGeoPlace, normalizeGeoPlaces } from "./transformers";

export const getPlaceSuggestions = async (searchText: string) => {
  const response = await apiFetchLocationPredictions(searchText);
  return normalizeGeoPlaces(response);
};

export const getPlacefromGeoCoords = async (
  lat: string | number,
  lng: string | number
) => {
  const response = await findNearbyPlaceName(lat, lng);
  return normalizeGeoPlaces(response)[0];
};

export const getPlaceById = async (id: number) => {
  const response = await apiFetchPlaceById(id);
  return normalizeGeoPlace(response);
};
