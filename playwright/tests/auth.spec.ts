import { URL_LIST } from "@data/url";
import { USER_PERMISSION } from "@data/userPermissions";
import { LoginPage } from "@pages/loginPage";
import { test } from "@playwright/test";

const adminFile = "playwright/.auth/admin.json";
const translationPermissionsFile = "playwright/.auth/translations.json";
const productPermissionsFile = "playwright/.auth/product.json";
const discountPermissionsFile = "playwright/.auth/discount.json";
const settingsPermissionsFile = "playwright/.auth/settings.json";
const staffMemberPermissionsFile = "playwright/.auth/staff-member.json";
const ordersPermissionsFile = "playwright/.auth/orders.json";
const shippingPermissionsFile = "playwright/.auth/shipping.json";
const appsPermissionsFile = "playwright/.auth/apps.json";
const pluginPermissionsFile = "playwright/.auth/plugins.json";
const productTypePermissionsFile = "playwright/.auth/product-type.json";
const giftCardsPermissionsFile = "playwright/.auth/gift-cards.json";
const contentPermissionsFile = "playwright/.auth/content.json";
const channelsWebhooksPermissionsFile =
  "playwright/.auth/channels-webhooks.json";
const customerWebhooksPermissionsFile = "playwright/.auth/customer.json";
const unauthenticatedUserPermissionsFile =
  "playwright/.auth/unauthenticated-user.json";

test("authenticate as admin", async ({ page }) => {
  const loginPage = await new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    process.env.E2E_USER_NAME!,
    process.env.E2E_USER_PASSWORD!,
    page,
    adminFile,
  );
});
test("unauthenticated user ", async ({ page }) => {
  const loginPage = await new LoginPage(page);
  await page.goto(URL_LIST.homePage);
  await loginPage.resetPasswordLink.waitFor({ state: "visible" });
  // End of authentication steps.
  await page
    .context()
    .storageState({ path: unauthenticatedUserPermissionsFile });
});
test("authenticate as user with discount permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.discount,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    discountPermissionsFile,
  );
});

test("authenticate as user with orders permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.order,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    ordersPermissionsFile,
  );
});
test("authenticate as user with apps permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.app,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    appsPermissionsFile,
  );
});
test("authenticate as user with channels permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.channel,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    channelsWebhooksPermissionsFile,
  );
});
test("authenticate as user with customer permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.customer,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    customerWebhooksPermissionsFile,
  );
});
test("authenticate as user with gift cards permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.giftCard,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    giftCardsPermissionsFile,
  );
});
test(
  "authenticate as user with content aka page permissions",
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAndSetStorageState(
      USER_PERMISSION.page,
      process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
      page,
      contentPermissionsFile,
    );
  },
);
test("authenticate as user with plugins permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.plugin,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    pluginPermissionsFile,
  );
});
test(
  "authenticate as user with product type permissions",
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAndSetStorageState(
      USER_PERMISSION.productTypeAndAttribute,
      process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
      page,
      productTypePermissionsFile,
    );
  },
);
test("authenticate as user with settings permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.settings,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    settingsPermissionsFile,
  );
});
test(
  "authenticate as user with staff member permissions",
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAndSetStorageState(
      USER_PERMISSION.staff,
      process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
      page,
      staffMemberPermissionsFile,
    );
  },
);
test("authenticate as user with shipping permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.shipping,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    shippingPermissionsFile,
  );
});
test("authenticate as user with translation permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.translations,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    translationPermissionsFile,
  );
});
test("authenticate as user with product permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.product,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    productPermissionsFile,
  );
});
