import { useEffect, useState } from "react";

const getGeoCoordinates = async () => {
  return new Promise<GeolocationCoordinates | null>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => reject(error)
      );
    } else {
      reject({
        message: "Geolocation is not supported by this browser.",
      });
    }
  });
};

type IGeolocationResponse = {
  coords: GeolocationCoordinates | null;
  error: Partial<GeolocationPositionError> | null;
  loading: boolean;
};

export const useGeolocation = (): IGeolocationResponse => {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [loading, setIsLoading] = useState(true);

  const [error, setError] = useState<Partial<GeolocationPositionError> | null>(
    null
  );

  useEffect(() => {
    let cancel = false;

    const getUserGeoCoordinates = async () => {
      try {
        const coords = await getGeoCoordinates();
        if (!cancel) setCoords(coords);
      } catch (error) {
        if (!cancel) setError(error as Partial<GeolocationPositionError>);
      } finally {
        if (!cancel) setIsLoading(false);
      }
    };

    getUserGeoCoordinates();

    return () => {
      cancel = true;
    };
  }, []);

  return {
    error,
    loading,
    coords,
  };
};
