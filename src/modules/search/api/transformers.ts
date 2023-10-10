import { GeoPlace, GeoLocationSearchResult, LocationGeoInfo } from "../types";

export const normalizeGeoPlace = (place: LocationGeoInfo): GeoPlace => {
  return {
    id: place.geonameId,
    name: place.name,
    admin1: place.adminName1,
    countryCode: place.countryCode,
    countryName: place.countryName,
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lng),
  };
};

export const normalizeGeoPlaces = (
  result: Omit<GeoLocationSearchResult, "totalResultsCount">
): GeoPlace[] => {
  return result.geonames.map((l) => normalizeGeoPlace(l));
};

export const getLocationDisplayText = (location: GeoPlace) => {
  const nameParts = [location.name];

  if (location.admin1) {
    nameParts.push(location.admin1);
  }
  nameParts.push(location.countryName);

  return nameParts.join(", ");
};
