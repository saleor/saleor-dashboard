import { USER_PERMISSION } from "@data/user-permissions";
import { HomePage } from "@pages/home-page";
import { LoginPage } from "@pages/login-page";
import { expect, test as setup } from "@playwright/test";

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

setup("authenticate as admin", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    process.env.CYPRESS_USER_NAME!,
    process.env.CYPRESS_USER_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: adminFile });
});
setup("authenticate as user with discount permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.discount,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: discountPermissionsFile });
});

setup("authenticate as user with orders permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.order,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: ordersPermissionsFile });
});
setup("authenticate as user with apps permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.app,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: appsPermissionsFile });
});
setup("authenticate as user with channels permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.channel,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: channelsWebhooksPermissionsFile });
});
setup("authenticate as user with customer permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.customer,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: customerWebhooksPermissionsFile });
});
setup("authenticate as user with gift cards permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.giftCard,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: giftCardsPermissionsFile });
});
setup(
  "authenticate as user with content aka page permissions",
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.setupLogin(
      USER_PERMISSION.page,
      process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
    );
    const homePage = new HomePage(page);
    await expect(homePage.welcomeMessage).toContainText("Hello there,");
    // End of authentication steps.
    await page.context().storageState({ path: contentPermissionsFile });
  },
);
setup("authenticate as user with plugins permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.plugin,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: pluginPermissionsFile });
});
setup(
  "authenticate as user with product type permissions",
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.setupLogin(
      USER_PERMISSION.productTypeAndAttribute,
      process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
    );
    const homePage = new HomePage(page);
    await expect(homePage.welcomeMessage).toContainText("Hello there,");
    // End of authentication steps.
    await page.context().storageState({ path: productTypePermissionsFile });
  },
);
setup("authenticate as user with settings permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.settings,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: settingsPermissionsFile });
});
setup(
  "authenticate as user with staff member permissions",
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.setupLogin(
      USER_PERMISSION.staff,
      process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
    );
    const homePage = new HomePage(page);
    await expect(homePage.welcomeMessage).toContainText("Hello there,");
    // End of authentication steps.
    await page.context().storageState({ path: staffMemberPermissionsFile });
  },
);
setup("authenticate as user with shipping permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.shipping,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: shippingPermissionsFile });
});
setup("authenticate as user with translation permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.translations,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: translationPermissionsFile });
});
setup("authenticate as user with product permissions", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.setupLogin(
    USER_PERMISSION.product,
    process.env.CYPRESS_PERMISSIONS_USERS_PASSWORD!,
  );
  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");
  // End of authentication steps.
  await page.context().storageState({ path: productPermissionsFile });
});
