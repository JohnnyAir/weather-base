import { noteKeys } from "../modules/notes/query";
import { measurementUnitQueryKey } from "../modules/weather/hooks/useMeasurementUnit";

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE = 60 * ONE_SECOND_IN_MS;

export const MS_TIME = {
  TEN_SECONDS: 10 * ONE_SECOND_IN_MS,
  TWENTY_SECONDS: 20 * ONE_SECOND_IN_MS,
  THIRTY_SECONDS: 30 * ONE_SECOND_IN_MS,
  ONE_MINUTE: ONE_MINUTE,
  FIVE_MINUTES: 5 * ONE_MINUTE,
};

//Query Keys
export const PERSISTED_QUERYS = [...noteKeys.all(), ...measurementUnitQueryKey];
