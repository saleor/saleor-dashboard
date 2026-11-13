import { isConnectionError } from "./connectionErrors";

interface OpenQuery {
  getCurrentResult: (saveAsLastResult?: boolean) => { error?: unknown; loading: boolean };
  getLastError: () => unknown;
  refetch: () => Promise<unknown>;
}

interface OpenQueries {
  getObservableQueries: (include: "active") => Map<string, OpenQuery>;
}

interface FailedQueryRecovery {
  /**
   * Reloads the open queries that failed because Saleor couldn't be reached, and returns how many
   * newly keep failing although Saleor answers.
   */
  reloadFailedQueries: (client: OpenQueries, options: { afterOutage: boolean }) => number;
}

/**
 * Once Saleor answers again, reloads the open queries that failed because it couldn't be reached.
 *
 * - Queries that loaded fine are left alone, so a form being edited isn't reset under the
 *   merchant. Mutations are never repeated: sending one twice could create something twice.
 * - Queries still loading are skipped: the answer that ended the outage may be their own.
 * - After a single failed request (no outage), each query is retried once. A query that keeps
 *   failing while Saleor answers other requests, such as one that times out every time, isn't
 *   retried again until an outage ends, and is counted so the merchant can be told.
 */
export function createFailedQueryRecovery(): FailedQueryRecovery {
  const retried = new WeakSet<OpenQuery>();
  const reported = new WeakSet<OpenQuery>();

  const reloadFailedQueries: FailedQueryRecovery["reloadFailedQueries"] = (
    client,
    { afterOutage },
  ) => {
    let keepFailing = 0;

    client.getObservableQueries("active").forEach(query => {
      const result = query.getCurrentResult(false);

      if (result.loading) {
        return;
      }

      if (!isConnectionError(result.error ?? query.getLastError())) {
        retried.delete(query);
        reported.delete(query);

        return;
      }

      if (!afterOutage && retried.has(query)) {
        if (!reported.has(query)) {
          reported.add(query);
          keepFailing += 1;
        }

        return;
      }

      retried.add(query);
      // A reload that fails again reports itself to the monitor through its request.
      query.refetch().catch(() => undefined);
    });

    return keepFailing;
  };

  return { reloadFailedQueries };
}
