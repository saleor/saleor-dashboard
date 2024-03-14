import { URL_LIST } from "@data/url";
import { AttributesPage } from "@pages/attributesPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/admin.json" });

test("TC: SALEOR_34 User should be able to create Dropdown attribute, required, Product attribute @e2e", async ({
  page,
}) => {
  const configurationPage = new ConfigurationPage(page);
  const attributesPage = new AttributesPage(page);
  const attributeDefaultLabel = `attribute default label - ${await attributesPage.basePage.getRandomInt(
    1000000,
  )}`;

  await page.goto(URL_LIST.configuration);

  await configurationPage.openAttributes();
  await attributesPage.clickCreateAttributeButton();
  await attributesPage.typeAttributeDefaultLabel(attributeDefaultLabel);
  await attributesPage.selectAttributeType("DROPDOWN");
  await attributesPage.clickAssignAttributeValueButton();
  await attributesPage.addValueDialog.typeAndSaveAttributeValue();
  await attributesPage.clickSaveButton();
  await attributesPage.basePage.expectSuccessBanner();
  await expect(await attributesPage.attributesRows.count()).toEqual(1);
  await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
  expect(await attributesPage.valueRequiredCheckbox.isChecked()).toBeTruthy();
});
test("TC: SALEOR_35 User should be able to create Plain Text attribute, not required, Product attribute @e2e", async ({
  page,
}) => {
  const attributesPage = new AttributesPage(page);
  const attributeDefaultLabel = `attribute default label - ${await attributesPage.basePage.getRandomInt(
    1000000,
  )}`;

  await page.goto(URL_LIST.addAttributes);

  await attributesPage.typeAttributeDefaultLabel(attributeDefaultLabel);
  await attributesPage.selectAttributeType("PLAIN_TEXT");
  await attributesPage.clickValueRequiredCheckbox();
  await attributesPage.clickSaveButton();
  await attributesPage.basePage.expectSuccessBanner();
  await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
  expect(await attributesPage.valueRequiredCheckbox.isChecked()).toBeFalsy();
});
