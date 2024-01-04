import { URL_LIST } from "@data/url";
import { HomePage } from "@pages/homePage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_29 Correct information on dashboard home page @basic-regression", async ({
  page,
}) => {
  const homePage = new HomePage(page);

  await page.goto(URL_LIST.homePage);
  await expect(homePage.channelSelect).toBeVisible({ timeout: 10000 });

  await homePage.expectHomePageElementsToBeVisible();
  const defaultChannelName = await homePage.channelSelect.innerText();

  await homePage.clickChannelSelectButton();
  await homePage.selectDifferentChannelThanGiven(defaultChannelName);
  const selectedChannelName = await homePage.channelSelect.innerText();

  await expect(defaultChannelName).not.toEqual(selectedChannelName);
  await homePage.expectHomePageElementsToBeVisible();
});
