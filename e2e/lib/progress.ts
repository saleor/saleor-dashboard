const suiteStart = Date.now();

const since = (from: number) => {
  const seconds = Math.round((Date.now() - from) / 1000);

  return `${Math.floor(seconds / 60)}m${String(seconds % 60).padStart(2, "0")}s`;
};

/**
 * Bringing a Saleor stack up, seeding it and building the dashboard are all minutes long
 * and silent by nature. Without a running commentary a run is indistinguishable from a
 * hang, so every phase announces itself *before* it starts.
 */
export const log = (message: string) => console.log(`[e2e ${since(suiteStart)}] ${message}`);

export const step = async <T>(label: string, run: () => T | Promise<T>): Promise<T> => {
  const began = Date.now();

  log(`> ${label}`);

  const result = await run();

  log(`+ ${label} (${since(began)})`);

  return result;
};

/**
 * Polls until `probe` reports `true`. Anything else it returns describes where things
 * stand; it is printed on the heartbeat and carried into the timeout message, because a
 * wait this long needs to be visible while it is still waiting.
 */
export const poll = async (
  label: string,
  probe: () => Promise<true | string>,
  {
    timeoutMs,
    intervalMs = 2000,
    heartbeatMs = 15_000,
  }: { timeoutMs: number; intervalMs?: number; heartbeatMs?: number },
) => {
  const began = Date.now();
  const deadline = began + timeoutMs;
  let state = "never attempted";
  let nextBeat = began + heartbeatMs;

  log(`> ${label}`);

  while (Date.now() < deadline) {
    const outcome = await probe();

    if (outcome === true) {
      log(`+ ${label} (${since(began)})`);

      return;
    }

    state = outcome;

    if (Date.now() >= nextBeat) {
      log(`. ${label}: ${state} - ${since(began)} of ${Math.round(timeoutMs / 1000)}s`);
      nextBeat = Date.now() + heartbeatMs;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error(`${label} did not finish within ${timeoutMs}ms (last: ${state})`);
};
