export type ApiErrorParams<ErrorPayload> = {
  message: string;
  code?: number;
  payload?: ErrorPayload;
  isRetryable?: boolean;
};

export class ApiError<Payload = unknown> extends Error {
  public type: string;
  public code: ApiErrorParams<Payload>["code"];
  public payload: Payload | undefined;
  public isRetryable: boolean;

  constructor(type: string, errorParams: ApiErrorParams<Payload>) {
    super();
    const { code, payload, message, isRetryable = false } = errorParams;
    this.code = code;
    this.type = type;
    this.message = message;
    this.payload = payload;
    this.isRetryable = isRetryable;
  }
}

export const genericRetryableErrorCodes = [408, 425, 429, 500, 502, 503, 504];

// ---- Helpers for errors ----

export const createError = <P>(
  type = "GenericErrorType",
  errorParams: ApiErrorParams<P>
) => {
  return new ApiError(type, errorParams);
};
