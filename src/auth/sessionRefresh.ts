import { ApolloError } from "@apollo/client";

// Shared by all SDK instances: login/logout must fence refreshes started by another instance.
let sessionVersion = 0;

export const getSessionVersion = (): number => sessionVersion;

export const advanceSession = (): void => {
  sessionVersion += 1;
};

export const assertCurrentSession = (version: number): void => {
  if (version !== sessionVersion) {
    throw new Error("Authentication session changed during token refresh");
  }
};

export class RefreshUnavailableError extends Error {
  constructor() {
    super("Token refresh is temporarily unavailable");
  }
}

export const isRefreshTokenRejected = (
  errors: ReadonlyArray<{ code?: string; field?: string | null }>,
): boolean =>
  errors.some(
    ({ code, field }) =>
      [
        "JWT_DECODE_ERROR",
        "JWT_INVALID_TOKEN",
        "JWT_MISSING_TOKEN",
        "JWT_SIGNATURE_EXPIRED",
        "INVALID_CREDENTIALS",
        "INACTIVE",
      ].includes(code ?? "") ||
      (code === "INVALID" && ["refreshToken", "token"].includes(field ?? "")),
  );

const isRetryable = (error: unknown): boolean => {
  if (error instanceof TypeError || error instanceof RefreshUnavailableError) {
    return true;
  }

  if (!(error instanceof ApolloError) || !error.networkError) {
    return false;
  }

  const statusCode = "statusCode" in error.networkError ? error.networkError.statusCode : undefined;

  return statusCode === undefined || statusCode === 429 || Number(statusCode) >= 500;
};

/** At most three attempts, scoped to the session that initiated the exchange. */
export const retryRefresh = async <T>({
  run,
  version,
}: {
  run: () => Promise<T>;
  version: number;
}): Promise<T> => {
  for (let attempt = 0; ; attempt += 1) {
    assertCurrentSession(version);

    try {
      return await run();
    } catch (error) {
      assertCurrentSession(version);

      if (attempt >= 2 || !isRetryable(error)) {
        throw error;
      }

      await new Promise<void>(resolve => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
};
