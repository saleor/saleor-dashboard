import { getConnectionFailure, getResponseConnectionFailure } from "./connectionErrors";
import { type ConnectionMonitor } from "./connectionMonitor";

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

interface TrackConnectionOptions {
  fetch: Fetch;
  monitor: Pick<ConnectionMonitor, "reportFailure" | "reportSuccess">;
}

/**
 * Wraps the fetch Apollo uses for the Saleor API, so every request tells the monitor whether
 * Saleor answered. The request itself passes through unchanged.
 */
export const trackConnection =
  ({ fetch, monitor }: TrackConnectionOptions): Fetch =>
  async (input, init) => {
    let response: Response;

    try {
      response = await fetch(input, init);
    } catch (error) {
      const failure = getConnectionFailure(error);

      if (failure) {
        monitor.reportFailure(failure);
      }

      throw error;
    }

    const failure = getResponseConnectionFailure(response);

    if (failure) {
      monitor.reportFailure(failure);
    } else {
      monitor.reportSuccess();
    }

    return response;
  };
