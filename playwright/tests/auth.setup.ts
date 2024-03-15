import { test } from "@playwright/test";
import { BasicApiService } from "@api/basics";
import fs from 'fs';
import path from 'path';

test("Authenticate as admin via API", async ({ request }) => {
    const basicApiService = new BasicApiService(request);

    // Log in via API to obtain the token
    const token = await basicApiService.loginViaApi(process.env.E2E_USER_NAME!, process.env.E2E_USER_PASSWORD!);

    // Store the token in a file
    const tempDir = path.join(__dirname, '.auth');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.join(tempDir, 'admin.json');
    fs.writeFileSync(tempFilePath, JSON.stringify({ token }));

    console.log('Token stored in', tempFilePath);
});
