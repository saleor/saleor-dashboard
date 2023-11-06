import { APIRequestContext, APIResponse } from "@playwright/test";

const URL = process.env.API_URI || "";
interface Data {
  query: string;
}

interface User {
  email: string;
  password: string;
}
export class BasicApiService {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
  async logInUserViaApi(
    user: User,
    authorization: string = "auth",
  ): Promise<APIResponse> {
    const headers = { Authorization: `Bearer ${authorization}` };

    const query = `mutation TokenAuth{
        tokenCreate(email: "${user.email}", password: "${user.password}") {
          token
          refreshToken 
          errors: errors {
            code
            field
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
    const loginResponseJson = await loginResponse.json();
    return loginResponseJson;
  }
}
