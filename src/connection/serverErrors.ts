import { ApolloError } from "@apollo/client";

import { hasStatusCode, isConnectionError } from "./connectionErrors";

/**
 * A request that got an answer the dashboard can't explain from its text, other than a lost
 * connection (502, 503 and 504, which the connection banner covers):
 * - `serverError`: Saleor failed with a 5xx, including its own HTML crash page;
 * - `refused`: the request was turned away with a 4xx that carries no message from Saleor, such as
 *   a proxy's "413 Request Entity Too Large" page or a firewall's 403;
 * - `unreadable`: a 2xx or 3xx answer that isn't JSON, such as a captive portal's sign-in page.
 */
export type ServerErrorProblem =
  | { kind: "serverError"; status: number }
  | { kind: "refused"; status: number }
  | { kind: "unreadable" };

/** Whether the answer's body holds error messages Saleor wrote for people. */
const hasSaleorMessages = (error: Error): boolean => {
  const result = "result" in error ? error.result : undefined;
  const errors =
    typeof result === "object" && result !== null && "errors" in result ? result.errors : undefined;

  return (
    Array.isArray(errors) &&
    errors.some(
      entry => typeof entry === "object" && entry !== null && "message" in entry && !!entry.message,
    )
  );
};

/**
 * What is wrong with a request's answer, when its raw error text (a JSON parser message, or
 * "Response not successful: Received status code 500") would mean nothing to a merchant. An
 * answer carrying Saleor's own error messages isn't covered: those are shown as they are.
 */
export function getServerErrorProblem(error: unknown): ServerErrorProblem | null {
  const networkError = error instanceof ApolloError ? error.networkError : error;

  if (
    !(networkError instanceof Error) ||
    !hasStatusCode(networkError) ||
    isConnectionError(networkError) ||
    hasSaleorMessages(networkError)
  ) {
    return null;
  }

  const status = networkError.statusCode;

  if (status >= 500) {
    return { kind: "serverError", status };
  }

  if (status >= 400) {
    return { kind: "refused", status };
  }

  // Apollo names the error it throws when a response body isn't JSON.
  return networkError.name === "ServerParseError" ? { kind: "unreadable" } : null;
}
