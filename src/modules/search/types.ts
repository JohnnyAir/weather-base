export type LocationGeoInfo = {
  lng: string;
  geonameId: number;
  toponymName: string;
  countryCode: string;
  name: string;
  fclName: string;
  countryName: string;
  lat: string;
  adminName1: string;
  adminCode1: string;
};

export type GeoLocationSearchResult = {
  totalResultsCount: number;
  geonames: LocationGeoInfo[];
};

export type GeoPlace = {
  id: number;
  name: string;
  admin1: string;
  countryCode: string;
  countryName: string;
  lat: number;
  lon: number;
};
