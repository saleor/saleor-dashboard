import { getResponseConnectionFailure } from "./connectionErrors";
import { type ConnectionCheckResult } from "./connectionMonitor";

// Answered by any GraphQL server without a token or a database query.
const CHECK_QUERY = JSON.stringify({ query: "query ConnectionCheck { __typename }" });

/** A check that gets no answer within this time counts as failed. */
export const CHECK_TIMEOUT_MS = 10_000;

/**
 * Asks the Saleor API whether it answers, outside Apollo so the check neither touches the cache
 * nor triggers a token refresh. Any answer counts, even an error: it proves Saleor is reachable.
 */
export async function checkConnection(apiUrl: string): Promise<ConnectionCheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: CHECK_QUERY,
      credentials: "include",
      signal: controller.signal,
    });
    const failure = getResponseConnectionFailure(response);

    return failure ? { ok: false, failure } : { ok: true };
  } catch {
    return { ok: false, failure: { httpStatus: 0, retryAfterMs: null } };
  } finally {
    clearTimeout(timeout);
  }
}
