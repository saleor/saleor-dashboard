import { defineConfig, test as setup } from "@playwright/test";
import { BasicApiService } from "@api/basics";
import fs from 'fs';
import path from 'path';

export default defineConfig({
    globalSetup: path.join(__dirname, 'auth.setup.ts'),
});

const authDirectory = path.join(__dirname, '.auth');
if (!fs.existsSync(authDirectory)) {
    fs.mkdirSync(authDirectory, { recursive: true });
}

setup("Authenticate as admin via API", async ({ request, context }) => {
    const basicApiService = new BasicApiService(request);

    const auth =
        await basicApiService.logInUserViaApi({
            email: process.env.E2E_USER_NAME!,
            password: process.env.E2E_USER_PASSWORD!,
        });

    const token = auth.data.tokenCreate.token;
    const tempFilePath = path.join(__dirname, "/../.auth/admin.json");
    fs.writeFileSync(tempFilePath, JSON.stringify({ token: token }));

    const storageDirectory = path.dirname(tempFilePath);
    await context.storageState({
        path: storageDirectory,
        cookies: [{ name: 'authorization-bearer', value: token, path: '/', domain: process.env.BASE_URL }],
    } as any);

    fs.unlinkSync(tempFilePath);
});
