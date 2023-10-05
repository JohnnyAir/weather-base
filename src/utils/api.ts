enum API_ERROR {
  BAD_RESPONSE = "BAD_RESPONSE",
  NETWORK_ERROR = "NETWORK_ERROR",
}

export class BadResponseError extends Error {
  statusCode: number;
  responseBody: any;

  constructor(message: string, statusCode: number, responseBody: any) {
    super(message);
    this.name = "BadResponseError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> {
  return fetch(input, init)
    .then(async (response) => {
      if (!response.ok) {
        const statusCode = response.status;
        const responseBody = await response.json();
        throw new BadResponseError(
          "Bad response from API",
          statusCode,
          responseBody
        );
      }
      return response;
    })
    .catch((error) => {
      if (error instanceof BadResponseError) {
        throw error;
      }
      throw API_ERROR.NETWORK_ERROR;
    });
}
