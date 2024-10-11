import { URL_LIST } from "@data/url";
import { HomePage } from "@pages/homePage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

test("TC: SALEOR_29 Correct information on dashboard home page @e2e", async ({ page }) => {
  const homePage = new HomePage(page);

  await page.goto(URL_LIST.homePage);
  await homePage.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
  await expect(homePage.channelSelect).toBeVisible({ timeout: 10000 });
  await homePage.expectHomePageElementsToBeVisible();

  const defaultChannelName = await homePage.channelSelect.innerText();

  await homePage.clickChannelSelectButton();
  await homePage.selectDifferentChannelThanGiven(defaultChannelName);

  const selectedChannelName = await homePage.channelSelect.innerText();

  await expect(defaultChannelName).not.toEqual(selectedChannelName);
  await homePage.expectHomePageElementsToBeVisible();
});
