import { APIRequestContext } from "@playwright/test";

interface User {
  email: string;
  password: string;
}

interface TokenCreateResponse {
  tokenCreate: {
    token: string;
    refreshToken: string;
    errors: [
      {
        message: string;
        code: string;
      },
    ];
    user: {
      id: string;
    };
  };
}

interface ApiResponse<T> {
  data: T;
}

const secondAndAHalf = 1500;

export class BasicApiService {
  readonly request: APIRequestContext;

  private static lock: Promise<void> | null = null;

  private static lastExecutionTime = 0;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  private static async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastExecution = now - BasicApiService.lastExecutionTime;

    if (timeSinceLastExecution < secondAndAHalf) {
      await new Promise(resolve => setTimeout(resolve, secondAndAHalf - timeSinceLastExecution));
    }
  }

  async logInUserViaApi(user: User): Promise<ApiResponse<TokenCreateResponse>> {
    // Wait if the last execution was within the last 1500ms.
    await BasicApiService.waitIfNeeded();

    // Acquire the global lock.
    while (BasicApiService.lock) {
      await BasicApiService.lock;
    }

    let releaseLock: () => void = () => {
      // Dummy release
    };

    // Create a new lock promise.
    BasicApiService.lock = new Promise<void>(resolve => {
      releaseLock = resolve;
    });

    try {
      const query = `mutation TokenAuth{
        tokenCreate(email: "${user.email}", password: "${user.password}") {
          token
          refreshToken
          errors: errors {
            code
            message
          }
          user {
            id
          }
        }
      }`;

      console.log(`Executing login request at: ${new Date().toISOString()}`);

      const loginResponse = await this.request.post(process.env.API_URL || "", {
        data: { query },
      });

      const loginResponseJson: { data: TokenCreateResponse } = await loginResponse.json();

      if (loginResponseJson.data.tokenCreate.errors?.length > 0) {
        const errorMessages = loginResponseJson.data.tokenCreate.errors
          .map(e => e.message)
          .join(", ");

        throw new Error(`Login failed: ${errorMessages}`);
      }

      // Update the last execution time.
      BasicApiService.lastExecutionTime = Date.now();

      return loginResponseJson as ApiResponse<TokenCreateResponse>;
    } finally {
      releaseLock();
      BasicApiService.lock = null;
    }
  }
}
