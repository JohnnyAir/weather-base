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

export type GeonameLocationSearchResult = {
  totalResultsCount: number;
  geonames: LocationGeoInfo[];
};
