import { APIRequestContext } from "@playwright/test";

const URL = process.env.API_URI || "";
interface Data {
  query: string;
}

interface User {
  email: string;
  password: string;
}
interface TokenCreateResponse {
  tokenCreate: {
    token: string;
    refreshToken: string;
    errors: [];
    user: { [key: string]: any };
  };
}

interface ApiResponse<T> {
  data: T;
}

export class BasicApiService {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async logInUserViaApi(user: User, authorization: string = "auth"): Promise<ApiResponse<TokenCreateResponse>> {
    const headers = { Authorization: `Bearer ${authorization}` };

    const query = `mutation TokenAuth {
        tokenCreate(email: "${user.email}", password: "${user.password}") {
          token
          refreshToken
          errors {
            code
            message
          }
          user {
            id
          }
        }
      }`;

    const data: Data = {
      query: query,
    };

    const loginResponse = await this.request.post(URL, { data, headers });

    if (!loginResponse.ok()) {
      throw new Error(`Failed to log in. Status: ${loginResponse.status()}`);
    }

    const loginResponseJson = await loginResponse.json();
    console.log("loginResponseJson", loginResponseJson);

    return loginResponseJson as ApiResponse<TokenCreateResponse>;
  }

  async loginViaApi(userEmail: string, userPassword: string): Promise<string> {
    const authResponse = await this.logInUserViaApi({ email: userEmail, password: userPassword });
    const token = authResponse.data.tokenCreate.token;
    return token;
  }
}
