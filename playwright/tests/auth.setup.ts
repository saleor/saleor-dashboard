import { USER_PERMISSION } from "@data/userPermissions";
import { LoginPage } from "@pages/loginPage";
import { test as setup } from "@playwright/test";

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

setup("authenticate as admin", async ({ page }) => {
  const loginPage = await new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    process.env.E2E_USER_NAME!,
    process.env.E2E_USER_PASSWORD!,
    page,
    adminFile,
  );
});
setup("unauthenticated user ", async ({ page }) => {
  const loginPage = await new LoginPage(page);
  await page.goto("/");
  await loginPage.resetPasswordLink.waitFor({ state: "visible" });
  // End of authentication steps.
  await page
    .context()
    .storageState({ path: unauthenticatedUserPermissionsFile });
});
setup("authenticate as user with discount permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.discount,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    discountPermissionsFile,
  );
});

setup("authenticate as user with orders permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.order,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    ordersPermissionsFile,
  );
});
setup("authenticate as user with apps permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.app,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    appsPermissionsFile,
  );
});
setup("authenticate as user with channels permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.channel,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    channelsWebhooksPermissionsFile,
  );
});
setup("authenticate as user with customer permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.customer,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    customerWebhooksPermissionsFile,
  );
});
setup("authenticate as user with gift cards permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.giftCard,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    giftCardsPermissionsFile,
  );
});
setup(
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
setup("authenticate as user with plugins permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.plugin,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    pluginPermissionsFile,
  );
});
setup(
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
setup("authenticate as user with settings permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.settings,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    settingsPermissionsFile,
  );
});
setup(
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
setup("authenticate as user with shipping permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.shipping,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    shippingPermissionsFile,
  );
});
setup("authenticate as user with translation permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.translations,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    translationPermissionsFile,
  );
});
setup("authenticate as user with product permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAndSetStorageState(
    USER_PERMISSION.product,
    process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    page,
    productPermissionsFile,
  );
});
