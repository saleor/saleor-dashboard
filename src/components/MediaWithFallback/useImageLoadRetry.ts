import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_DELAY_MS = 2_000;
const FACTOR = 2;
const MAX_DELAY_MS = 30_000;
const MAX_TOTAL_MS = 120_000;

const delayForAttempt = (attempt: number): number =>
  Math.min(INITIAL_DELAY_MS * FACTOR ** attempt, MAX_DELAY_MS);

const elapsedBeforeAttempt = (attempt: number): number => {
  let elapsed = 0;

  for (let i = 0; i < attempt; i++) {
    elapsed += delayForAttempt(i);
  }

  return elapsed;
};

interface UseImageLoadRetry {
  /** Bumped after each backoff delay — use as `key` on the `<img>` to force a fresh request. */
  attempt: number;
  /** Call on image load error. Returns false when the retry budget is exhausted. */
  handleError: () => boolean;
}

/**
 * Retries failed image loads with exponential backoff (2s, 4s, 8s, ... capped at 30s,
 * ~2 minutes total). Saleor generates thumbnails lazily and serves 503 until ready,
 * so transient load errors usually resolve on their own.
 */
export const useImageLoadRetry = (src: string | undefined): UseImageLoadRetry => {
  const [attempt, setAttempt] = useState(0);
  const [prevSrc, setPrevSrc] = useState(src);
  const timeoutRef = useRef<number>();

  if (prevSrc !== src) {
    setPrevSrc(src);
    setAttempt(0);
  }

  useEffect(
    function clearPendingRetry() {
      return (): void => window.clearTimeout(timeoutRef.current);
    },
    [src],
  );

  const handleError = useCallback(() => {
    const delay = delayForAttempt(attempt);

    if (elapsedBeforeAttempt(attempt) + delay > MAX_TOTAL_MS) {
      return false;
    }

    timeoutRef.current = window.setTimeout(() => setAttempt(prev => prev + 1), delay);

    return true;
  }, [attempt]);

  return { attempt, handleError };
};
