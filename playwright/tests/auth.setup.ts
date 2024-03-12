import { test as setup } from "@playwright/test";
import { BasicApiService } from "@api/basics";
import fs from 'fs';

setup("Authenticate as admin via API", async ({ request, context }) => {
    const basicApiService = new BasicApiService(request);

    const auth =
        await basicApiService.logInUserViaApi({
            email: process.env.E2E_USER_NAME!,
            password: process.env.E2E_USER_PASSWORD!,
        });

    const token = auth.data.tokenCreate.token
    const tempFilePath = 'temp_admin.json';
    fs.writeFileSync(tempFilePath, JSON.stringify({ token: token }));
    await context.storageState({
        path: tempFilePath,
        Headers: [{ name: 'authorization-bearer', value: token, path: '/', domain: process.env.BASE_URL}],
    } as any);
    fs.unlinkSync(tempFilePath);
});
