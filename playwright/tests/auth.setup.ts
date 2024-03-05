import { test as setup } from "@playwright/test";
import { BasicApiService } from "@api/basics";
const adminFile = "../.auth/admin.json";
setup("Authenticate as admin via API", async ({ request, context }) => {
    const basicApiService = new BasicApiService(request);

    const auth =
        await basicApiService.logInUserViaApi({
            email: process.env.E2E_USER_NAME!,
            password: process.env.E2E_USER_PASSWORD!,
        });

    const token = auth.data.tokenCreate.token

    await context.storageState({
        path: adminFile,
        Headers: [{ name: 'authorization-bearer', value: token, path: '/', domain: process.env.BASE_URL}],
    } as any);
});
