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

interface BasicApiServiceOptions {
  request: APIRequestContext;
  workerIndex: number;
}

const DELAY_BETWEEN_REQUESTS = 1000;
const LOCK_FILE_PATH = path.join(__dirname, "../.auth", "lockfile");

export class BasicApiService {
  readonly request: APIRequestContext;

  readonly workerIndex: number;

  private static lastExecutionTime = 0;

  constructor(options: BasicApiServiceOptions) {
    this.request = options.request;
    this.workerIndex = options.workerIndex;
  }

  async logInUserViaApi(user: User): Promise<ApiResponse<TokenCreateResponse>> {
    await this.waitIfNeeded();
    await this.acquireLock();

    try {
      const query = this.buildLoginQuery(user);

      this.log(`Executing login request for ${user.email}`);

      const loginResponse = await this.request.post(process.env.API_URL || "", {
        data: { query },
      });

      const loginResponseJson: { data: TokenCreateResponse } = await loginResponse.json();

      this.handleLoginErrors(loginResponseJson, user);

      BasicApiService.lastExecutionTime = Date.now();

      return loginResponseJson as ApiResponse<TokenCreateResponse>;
    } finally {
      this.releaseLock();
    }
  }

  private async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastExecution = now - BasicApiService.lastExecutionTime;

    if (timeSinceLastExecution < DELAY_BETWEEN_REQUESTS) {
      this.log(`Waiting for ${DELAY_BETWEEN_REQUESTS - timeSinceLastExecution}ms`);
      await new Promise(resolve =>
        setTimeout(resolve, DELAY_BETWEEN_REQUESTS - timeSinceLastExecution),
      );
    }
  }

  private async acquireLock(): Promise<void> {
    while (fs.existsSync(LOCK_FILE_PATH)) {
      this.log(`Waiting for lock to be released`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.log(`Acquiring lock`);
    fs.writeFileSync(LOCK_FILE_PATH, "");
  }

  private releaseLock(): void {
    if (fs.existsSync(LOCK_FILE_PATH)) {
      this.log(`Releasing lock`);
      fs.unlinkSync(LOCK_FILE_PATH);
    }
  }

  private buildLoginQuery(user: User): string {
    return `mutation TokenAuth{
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
  }

  private handleLoginErrors(loginResponseJson: { data: TokenCreateResponse }, user: User): void {
    if (loginResponseJson.data.tokenCreate.errors?.length > 0) {
      const errorMessages = loginResponseJson.data.tokenCreate.errors
        .map(e => e.message)
        .join(", ");

      this.log(`Login failed for ${user.email}: ${errorMessages}`, true);
      throw new Error(`Login failed: ${errorMessages}`);
    }
  }

  private log(message: string, isError = false): void {
    const logMessage = `[BasicApiService][Worker ${this.workerIndex}] ${message} at: ${new Date().toISOString()}`;

    if (isError) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }
}
