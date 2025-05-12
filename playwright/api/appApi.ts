import { APIRequestContext, request } from "@playwright/test";

import { BasicApiService } from "./basics";

const APP_CREATE_MUTATION = `
  mutation AppCreateMinimal($input: AppInput!) {
    appCreate(input: $input) {
      authToken
      app {
        id
      }
      errors {
        code
        message
      }
    }
  }
`;

const APP_DELETE_MUTATION = `
  mutation AppDeleteMinimal($id: ID!) {
    appDelete(id: $id) {
      errors {
        code
        message
      }
    }
  }
`;

interface GQLError {
  code: string;
  message: string | null;
}

interface AppCreateResponse {
  data: {
    appCreate: {
      authToken: string | null;
      app: {
        id: string;
      } | null;
      errors: GQLError[];
    };
  };
}

interface AppDeleteResponse {
  data: {
    appDelete: {
      errors: GQLError[];
    };
  };
}

async function getAdminApiRequestContext(): Promise<APIRequestContext> {
  const email = process.env.E2E_USER_NAME!;
  const password = process.env.E2E_USER_PASSWORD!;

  // Create a temporary context to log in and get the token
  const tempContext = await request.newContext({ baseURL: process.env.API_URL! });
  const basicApiService = new BasicApiService(tempContext);
  const loginResponse = await basicApiService.logInUserViaApi({ email, password });
  const token = loginResponse.data.tokenCreate.token;

  await tempContext.dispose();

  if (!token) throw new Error("Admin login failed: No token returned");

  // Now create a new context with the Authorization header set
  const apiRequestContext = await request.newContext({
    baseURL: process.env.API_URL!,
    extraHTTPHeaders: { Authorization: `Bearer ${token}` },
  });

  return apiRequestContext;
}

/**
 * Creates a custom app via API as admin.
 * Throws an error if creation fails.
 */
export async function createCustomApp(
  _request: APIRequestContext, // ignored, for compatibility
  appName: string,
  permissions: string[],
): Promise<{ id: string; token: string }> {
  const adminRequest = await getAdminApiRequestContext();
  const response = await adminRequest.post(process.env.API_URL || "", {
    data: {
      operationName: "AppCreateMinimal",
      variables: {
        input: {
          name: appName,
          permissions: permissions,
        },
      },
      query: APP_CREATE_MUTATION,
    },
  });

  if (response.status() !== 200) {
    await adminRequest.dispose();
    throw new Error(
      `App creation API request failed with status ${response.status()}: ${await response.text()}`,
    );
  }

  const jsonResponse = (await response.json()) as AppCreateResponse;

  console.log("App create mutation response:", JSON.stringify(jsonResponse, null, 2));

  const appData = jsonResponse.data?.appCreate;
  const errors = appData?.errors || [];

  if (errors.length > 0) {
    await adminRequest.dispose();
    throw new Error(`App creation failed with GraphQL errors: ${JSON.stringify(errors)}`);
  }

  if (!appData?.app?.id || !appData?.authToken) {
    await adminRequest.dispose();
    throw new Error(
      `App creation failed: Missing ID or auth token in API response. Response: ${JSON.stringify(
        jsonResponse.data,
      )}`,
    );
  }

  await adminRequest.dispose();

  return { id: appData.app.id, token: appData.authToken };
}

/**
 * Deletes a custom app via API as admin.
 * Throws an error if deletion fails unexpectedly (ignores 'not found' errors).
 */
export async function deleteCustomApp(_request: APIRequestContext, appId: string): Promise<void> {
  const adminRequest = await getAdminApiRequestContext();
  const response = await adminRequest.post(process.env.API_URL || "", {
    data: {
      operationName: "AppDeleteMinimal",
      variables: {
        id: appId,
      },
      query: APP_DELETE_MUTATION,
    },
  });

  if (response.status() !== 200) {
    await adminRequest.dispose();
    throw new Error(
      `App deletion API request failed with status ${response.status()}: ${await response.text()}`,
    );
  }

  const jsonResponse = (await response.json()) as AppDeleteResponse;
  const errors = jsonResponse.data?.appDelete?.errors || [];

  // Handle cases where app might already be deleted (idempotency)
  if (errors.length > 0) {
    const isNotFoundError = errors.some(
      err => err.code === "NOT_FOUND" || err.code === "GRAPHQL_ERROR",
    );

    if (!isNotFoundError) {
      await adminRequest.dispose();
      throw new Error(`App deletion failed with GraphQL errors: ${JSON.stringify(errors)}`);
    } else {
      console.log(`App ${appId} already deleted or not found during teardown.`);
    }
  }

  await adminRequest.dispose();
}
