import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/translations.json" });

test("TC: SALEOR_22 User should be able to navigate to translations page as a staff member using TRANSLATION permission", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const basePage = new BasePage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openTranslations();
  await expect(basePage.pageHeader).toHaveText("Languages");
  await mainMenuPage.expectMenuItemsCount(2);
});
