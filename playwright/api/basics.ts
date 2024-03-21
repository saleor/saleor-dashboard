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

export class BasicApiService {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async logInUserViaApi(user: User): Promise<ApiResponse<TokenCreateResponse>> {
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

        const loginResponse = await this.request.post(process.env.API_URI || "", { data: { query } });
        const loginResponseJson = await loginResponse.json();

        return loginResponseJson as ApiResponse<TokenCreateResponse>;
    }
}
