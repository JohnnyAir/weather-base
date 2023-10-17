import { apiFetch } from "../../client/api";
import {
  GeoLocationSearchResult,
  GeoNameApiError,
  LocationGeoInfo,
} from "../types";
import {
  createErrorFromGeonameApiErrorResponse,
  isErrorResponse,
} from "./error";

const geonameApiUsername = import.meta.env.VITE_GEONAME_USERNAME;
const baseUrl = "https://secure.geonames.org/";

const MAX_SUGGESTED_LOCATIONS = 8;

export const apiFetchLocationPredictions = async (
  location: string,
  count = MAX_SUGGESTED_LOCATIONS
): Promise<GeoLocationSearchResult> => {
  const locationEncoded = encodeURI(location);

  const geonameEndpoint = `${baseUrl}searchJSON?name_startsWith=${locationEncoded}&username=${geonameApiUsername}&style=medium&maxRows=${count}`;

  const response = await apiFetch(geonameEndpoint);
  const data = (await response.json()) as
    | GeoLocationSearchResult
    | GeoNameApiError;
  if (isErrorResponse(data)) {
    throw createErrorFromGeonameApiErrorResponse(data);
  }
  return data;
};

export const findNearbyPlaceName = async (
  lat: number | string,
  lng: number | string
): Promise<Omit<GeoLocationSearchResult, "totalResultsCount">> => {
  const geonameEndpoint = `${baseUrl}findNearbyPlaceNameJSON?lat=${lat}&lng=${lng}&style=medium&username=${geonameApiUsername}`;
  const response = await apiFetch(geonameEndpoint);
  const data = (await response.json()) as
    | GeoLocationSearchResult
    | GeoNameApiError;
  if (isErrorResponse(data)) {
    throw createErrorFromGeonameApiErrorResponse(data);
  }
  return data;
};

export const apiFetchPlaceById = async (
  geonameId: number | string
): Promise<LocationGeoInfo> => {
  const geonameEndpoint = `${baseUrl}getJSON?geonameId=${geonameId}&style=medium&username=${geonameApiUsername}`;
  const response = await apiFetch(geonameEndpoint);
  const data = (await response.json()) as LocationGeoInfo | GeoNameApiError;
  if (isErrorResponse(data)) {
    throw createErrorFromGeonameApiErrorResponse(data);
  }
  return data;
};
