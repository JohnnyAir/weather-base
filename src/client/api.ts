import { ApiError, createError, genericRetryableErrorCodes } from "./error";

export function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> {
  return fetch(input, init)
    .then(async (response) => {
      if (!response.ok) {
        const statusCode = response.status;
        const responseBody = await response.json();
        const errorMessage =
          typeof responseBody === "object"
            ? responseBody.message
            : "An Error Occured";
        throw createError("genericApiResponseError", {
          message: errorMessage,
          code: statusCode,
          payload: responseBody,
          isRetryable: genericRetryableErrorCodes.includes(statusCode),
        });
      }
      return response;
    })
    .catch((error: Error) => {
      if (error instanceof ApiError) {
        throw error;
      }
      throw createError(error.name, {
        message: `${error.message}. Try checking your Internet connection.`,
        code: -1,
        payload: error.stack,
        isRetryable: true,
      });
    });
}
