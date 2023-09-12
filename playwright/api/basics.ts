import {
  APIResponse,
  request,
} from "@playwright/test";

const URL = process.env.API_URI || "";
interface DATA {
  query: string;
}

interface USER {
  email: string;
  password: string;
}
export class GraphQLService {
  async example(
    user: USER,
    authorization: string = "auth",
  ): Promise<APIResponse> {
    const headers = { Authorization: `Bearer ${authorization}` };

    const api = await request.newContext();
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
    const data: DATA = {
      query: query,
    };
    const loginResponse = await api.post(URL, { data, headers });
    return loginResponse;
  }
}
