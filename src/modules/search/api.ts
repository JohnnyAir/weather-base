import { apiFetch } from "../../utils/api";
import { GeonameLocationSearchResult, LocationGeoInfo } from "./types";
const geonameApiUsername = "toursom";
const baseUrl = "https://secure.geonames.org/";

export const fetchLocationPredictions = async (
  location: string
): Promise<GeonameLocationSearchResult> => {
  const locationEncoded = encodeURI(location);

  const geonameEndpoint = `${baseUrl}searchJSON?name_startsWith=${locationEncoded}&username=${geonameApiUsername}&style=medium`;

  const response = await apiFetch(geonameEndpoint);
  const data = (await response.json()) as GeonameLocationSearchResult;

  return data;
};

export const findNearbyPlaceName = async (
  lat: number | string,
  lng: number | string
): Promise<Omit<GeonameLocationSearchResult, "totalResultsCount">> => {
  const geonameEndpoint = `${baseUrl}findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&style=medium&username=${geonameApiUsername}`;
  const response = await apiFetch(geonameEndpoint);
  const data = (await response.json()) as GeonameLocationSearchResult;
  return data;
};

export const getPlace = async (
  geonameId: number | string
): Promise<LocationGeoInfo> => {
  const geonameEndpoint = `${baseUrl}getJSON?geonameId=${geonameId}&style=medium&username=${geonameApiUsername}`;
  const response = await apiFetch(geonameEndpoint);
  const data = (await response.json()) as LocationGeoInfo;
  return data;
};

export const getLocationDisplayText = (location: LocationGeoInfo) => {
  const nameParts = [location.name];

  if (location.adminName1) {
    nameParts.push(location.adminName1);
  }
  nameParts.push(location.countryName);

  return nameParts.join(", ");
};
