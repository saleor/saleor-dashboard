import { ADMIN, type E2eConfig } from "../config.ts";

export const gql = async <T>(
  config: E2eConfig,
  query: string,
  variables: Record<string, unknown> = {},
  token?: string,
): Promise<T> => {
  const response = await fetch(config.apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`${config.apiUrl} answered ${response.status}`);
  }

  const body = (await response.json()) as { data?: T; errors?: { message: string }[] };

  if (body.errors?.length) {
    throw new Error(body.errors.map(error => error.message).join("; "));
  }

  if (!body.data) {
    throw new Error("response carried neither data nor errors");
  }

  return body.data;
};

/**
 * Saleor reports mutation failures in the payload rather than as GraphQL errors, so a
 * seed step that silently did nothing would otherwise surface much later as a missing row.
 */
export const assertNoMutationErrors = (name: string, errors: unknown): void => {
  if (Array.isArray(errors) && errors.length > 0) {
    throw new Error(`${name}: ${JSON.stringify(errors)}`);
  }
};

/**
 * `tokenCreate` mints both in one round trip. Seeding drives the API with the access token;
 * a stored browser session carries only the refresh one (see `lib/auth.ts`).
 */
export const signIn = async (
  config: E2eConfig,
  email: string,
  password: string,
): Promise<{ token: string; refreshToken: string }> => {
  const data = await gql<{
    tokenCreate: {
      token: string | null;
      refreshToken: string | null;
      errors: { message: string }[];
    };
  }>(
    config,
    `mutation($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token
        refreshToken
        errors { field code message }
      }
    }`,
    { email, password },
  );

  assertNoMutationErrors(`tokenCreate(${email})`, data.tokenCreate.errors);

  const { token, refreshToken } = data.tokenCreate;

  if (!token || !refreshToken) {
    throw new Error(`tokenCreate returned no token for ${email}`);
  }

  return { token, refreshToken };
};

export const adminToken = async (config: E2eConfig): Promise<string> =>
  (await signIn(config, ADMIN.email, ADMIN.password)).token;
