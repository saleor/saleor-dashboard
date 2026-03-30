import { AppsApiService } from "@api/apps";
import { BasicApiService } from "@api/basics";
import { APP_SMOKE_DATA, getAppsForCurrentEnv, resolveAppUrl } from "@data/appSmokeTestData";
import { LOCATORS } from "@data/commonLocators";
import { type APIRequestContext, expect, request as playwrightRequest } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

const APP_LOAD_TIMEOUT = 30_000;
const { version, apps } = getAppsForCurrentEnv();

console.log(
  `App smoke tests: resolved version "${version}" from BASE_URL "${process.env.BASE_URL || ""}"` +
    (process.env.APP_IDENTIFIERS ? `, filtering by: ${process.env.APP_IDENTIFIERS}` : ""),
);

if (!version || apps.length === 0) {
  console.warn(
    `App smoke tests: no test data for version "${version}". ` +
      `Supported versions: ${Object.keys(APP_SMOKE_DATA).join(", ")}. Tests will not run.`,
  );
}

let appsApi: AppsApiService;
let requestContext: APIRequestContext;

test.beforeAll(async () => {
  requestContext = await playwrightRequest.newContext();

  const basicApi = new BasicApiService(requestContext);
  const loginResponse = await basicApi.logInUserViaApi({
    email: process.env.E2E_USER_NAME!,
    password: process.env.E2E_USER_PASSWORD!,
  });

  const token = loginResponse.data.tokenCreate.token;

  appsApi = new AppsApiService(requestContext, token);
});

test.afterAll(async () => {
  await requestContext?.dispose();
});

apps.forEach(app => {
  test(`TC: APP_SMOKE - [${version}] ${app.name} app renders and loads configuration #e2e`, async ({
    page,
  }) => {
    const appId = await appsApi.getAppIdByIdentifier(app.identifier);
    const appUrl = resolveAppUrl(version, appId);

    await page.goto(appUrl);
    const appFrame = page.locator('[data-test-id="app-frame"]');

    await expect(appFrame).toBeVisible({ timeout: APP_LOAD_TIMEOUT });

    const iframeLocator = page.frameLocator('[data-test-id="app-frame"]');

    await expect(iframeLocator.getByText(app.heading).first()).toBeVisible({
      timeout: APP_LOAD_TIMEOUT,
    });

    await app.assertContent(iframeLocator, APP_LOAD_TIMEOUT);

    await expect(page.locator(LOCATORS.errorBanner)).not.toBeVisible();
  });
});
