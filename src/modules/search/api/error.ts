import { createError } from "../../client/error";
import {
  GeoLocationSearchResult,
  GeoNameApiError,
  LocationGeoInfo,
} from "../types";

const ERROR_CODES = {
  AUTHORIZATION_EXCEPTION: 10,
  RECORD_DOES_NOT_EXIST: 11,
  OTHER_ERROR: 12,
  DATABASE_TIMEOUT: 13,
  INVALID_PARAMETER: 14,
  NO_RESULT_FOUND: 15,
  DUPLICATE_EXCEPTION: 16,
  POSTAL_CODE_NOT_FOUND: 17,
  DAILY_LIMIT_OF_CREDITS_EXCEEDED: 18,
  HOURLY_LIMIT_OF_CREDITS_EXCEEDED: 19,
  WEEKLY_LIMIT_OF_CREDITS_EXCEEDED: 20,
  INVALID_INPUT: 21,
  SERVER_OVERLOADED_EXCEPTION: 22,
  SERVICE_NOT_IMPLEMENTED: 23,
  RADIUS_TOO_LARGE: 24,
  MAXROWS_TOO_LARGE: 27,
};

const retryableErrorCodes = [
  ERROR_CODES.DATABASE_TIMEOUT,
  ERROR_CODES.OTHER_ERROR,
  ERROR_CODES.SERVER_OVERLOADED_EXCEPTION,
];

const getErrorMessage = (errorCode: number) => {
  if (retryableErrorCodes.includes(errorCode)) {
    return "Unable to fetch place at the moment. Please try again later";
  }

  if (
    [
      ERROR_CODES.INVALID_PARAMETER,
      ERROR_CODES.RECORD_DOES_NOT_EXIST,
      ERROR_CODES.NO_RESULT_FOUND,
      ERROR_CODES.POSTAL_CODE_NOT_FOUND,
    ].includes(errorCode)
  ) {
    return "Cannot find place. Please use the search bar above to find cities and view weather";
  }

  return "Unable to fetch";
};

export const isErrorResponse = (
  data: LocationGeoInfo | GeoLocationSearchResult | GeoNameApiError
): data is GeoNameApiError => {
  return !!(data as GeoNameApiError).status;
};

export const createErrorFromGeonameApiErrorResponse = (
  response: GeoNameApiError
) => {
  const code = response.status.value;
  return createError("GeoNameApiError", {
    message: getErrorMessage(code),
    payload: response,
    code: code,
    isRetryable: retryableErrorCodes.includes(code),
  });
};
