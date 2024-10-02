import { APIRequestContext } from "@playwright/test";
import fs from "fs";
import path from "path";

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

const delayBetweenRequests = 1000;
const LOCK_FILE_PATH = path.join(__dirname, "../.auth", "lockfile");

export class BasicApiService {
  readonly request: APIRequestContext;

  readonly workerIndex: number;

  private static lastExecutionTime = 0;

  constructor(request: APIRequestContext, workerIndex: number) {
    this.request = request;
    this.workerIndex = workerIndex;
  }

  private async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastExecution = now - BasicApiService.lastExecutionTime;

    if (timeSinceLastExecution < delayBetweenRequests) {
      console.log(
        `[BasicApiService][Worker ${this.workerIndex}] Waiting for ${delayBetweenRequests - timeSinceLastExecution}ms`,
      );
      await new Promise(resolve =>
        setTimeout(resolve, delayBetweenRequests - timeSinceLastExecution),
      );
    }
  }

  private async acquireLock(): Promise<void> {
    while (fs.existsSync(LOCK_FILE_PATH)) {
      console.log(`[BasicApiService][Worker ${this.workerIndex}] Waiting for lock to be released`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`[BasicApiService][Worker ${this.workerIndex}] Acquiring lock`);
    fs.writeFileSync(LOCK_FILE_PATH, "");
  }

  private releaseLock(): void {
    if (fs.existsSync(LOCK_FILE_PATH)) {
      console.log(`[BasicApiService][Worker ${this.workerIndex}] Releasing lock`);
      fs.unlinkSync(LOCK_FILE_PATH);
    }
  }

  async logInUserViaApi(user: User): Promise<ApiResponse<TokenCreateResponse>> {
    await this.waitIfNeeded();

    await this.acquireLock();

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

      console.log(
        `[BasicApiService][Worker ${this.workerIndex}][Email: ${user.email}] Executing login request at: ${new Date().toISOString()}`,
      );

      const loginResponse = await this.request.post(process.env.API_URL || "", {
        data: { query },
      });

      const loginResponseJson: { data: TokenCreateResponse } = await loginResponse.json();

      if (loginResponseJson.data.tokenCreate.errors?.length > 0) {
        const errorMessages = loginResponseJson.data.tokenCreate.errors
          .map(e => e.message)
          .join(", ");

        console.error(
          `[BasicApiService][Worker ${this.workerIndex}][Email: ${user.email}] Login failed: ${errorMessages}`,
        );
        throw new Error(`Login failed: ${errorMessages}`);
      }

      BasicApiService.lastExecutionTime = Date.now();

      return loginResponseJson as ApiResponse<TokenCreateResponse>;
    } finally {
      this.releaseLock();
    }
  }
}
