import { ApolloError } from "@apollo/client";

/** Saleor didn't answer: no response at all, or its proxy reported the API as down. */
export interface ConnectionFailure {
  /** 0 when the request got no response at all. */
  httpStatus: number;
  /** How long a 503 asked clients to wait before trying again. */
  retryAfterMs: number | null;
}

// A proxy in front of Saleor answers these when the API itself can't be reached. Any other
// status, 500 included, comes from a Saleor that is up.
const UNREACHABLE_STATUSES = new Set([502, 503, 504]);

// What browsers say when `fetch` gets no response. Any other TypeError is a bug in the code that
// made the request, not a connection problem.
const NO_RESPONSE_MESSAGES = new Set([
  "Failed to fetch", // Chrome, Edge
  "NetworkError when attempting to fetch resource.", // Firefox
  "Load failed", // Safari 17+
  "The Internet connection appears to be offline.", // Safari 16
  "The network connection was lost.", // Safari 16
  "Could not connect to the server.", // Safari 16
  "A server with the specified hostname could not be found.", // Safari 16
  "The request timed out.", // Safari 16
]);

function parseRetryAfter(value: string | null, now: number): number | null {
  if (!value) {
    return null;
  }

  const seconds = Number(value);

  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const date = Date.parse(value);

  return Number.isNaN(date) ? null : Math.max(0, date - now);
}

/** The parts of a `Response` that say whether Saleor answered. */
interface ResponseLike {
  status: number;
  headers: { get: (name: string) => string | null };
}

export function getResponseConnectionFailure(
  response: ResponseLike,
  now: number = Date.now(),
): ConnectionFailure | null {
  if (!UNREACHABLE_STATUSES.has(response.status)) {
    return null;
  }

  return {
    httpStatus: response.status,
    retryAfterMs: parseRetryAfter(response.headers.get("Retry-After"), now),
  };
}

/** Apollo's ServerError and ServerParseError keep the status of the response they came from. */
export const hasStatusCode = (
  error: object,
): error is { statusCode: number; response?: ResponseLike } =>
  "statusCode" in error && typeof error.statusCode === "number";

/**
 * Why a request failed to reach Saleor, or null when it reached Saleor (or was cancelled) and
 * failed for another reason.
 *
 * Not the same question as `isTransientRequestError` in `src/auth/errors.ts`, which asks whether a
 * failed token refresh might still leave the session valid. A 500 during a refresh keeps the
 * session there, while here it proves Saleor answered. Both hold at once.
 *
 * A browser also reports an error response blocked by CORS as no response, so this can't tell
 * those two apart.
 */
export function getConnectionFailure(error: unknown): ConnectionFailure | null {
  if (error instanceof ApolloError) {
    return error.networkError ? getConnectionFailure(error.networkError) : null;
  }

  if (!(error instanceof Error)) {
    return null;
  }

  if (error instanceof TypeError) {
    return NO_RESPONSE_MESSAGES.has(error.message) ? { httpStatus: 0, retryAfterMs: null } : null;
  }

  // Apollo's ServerError and ServerParseError keep the status of the response they came from.
  if (hasStatusCode(error)) {
    if (error.response?.headers) {
      return getResponseConnectionFailure(error.response);
    }

    return UNREACHABLE_STATUSES.has(error.statusCode)
      ? { httpStatus: error.statusCode, retryAfterMs: null }
      : null;
  }

  return null;
}

export const isConnectionError = (error: unknown): boolean => getConnectionFailure(error) !== null;
