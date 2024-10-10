import { ATTRIBUTES } from "@data/e2eTestData";
import { AttributesPage } from "@pages/attributesPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let attributesPage: AttributesPage;
let configurationPage: ConfigurationPage;

test.beforeEach(({ page }) => {
  attributesPage = new AttributesPage(page);
  configurationPage = new ConfigurationPage(page);
});

const SALEOR_124_uuid = faker.datatype.uuid();
const attributeClasses = ["PRODUCT_TYPE", "PAGE_TYPE"];

for (const attr of attributeClasses) {
  for (const type of ATTRIBUTES.attributeTypesWithAbilityToAddValues.names) {
    const uniqueSlug = `${attr}-${type}-${SALEOR_124_uuid}`.replace(/\s+/g, "-");

    test(`TC: SALEOR_124 User should be able to create ${attr} ${type} attribute with ability to add values, required, public @e2e @attributes`, async ({
      page,
    }) => {
      await page.context().storageState({ path: "./playwright/.auth/admin.json" });
      await configurationPage.goToConfigurationView();
      await configurationPage.openAttributes();
      await attributesPage.clickCreateAttributeButton();
      await attributesPage.selectAttributeType(attr);
      await attributesPage.typeAttributeDefaultLabel(`${attr} - ${type}`);
      await attributesPage.fillAttributeSlug(uniqueSlug);
      await attributesPage.selectAttributeInputType(type);
      await expect(attributesPage.attrValuesSection).toBeVisible();
      await attributesPage.clickAssignAttributeValueButton();
      await attributesPage.addValueDialog.typeAndSaveAttributeValue();
      await attributesPage.waitForNetworkIdleAfterAction(() => attributesPage.clickSaveButton());
      await attributesPage.expectSuccessBanner();
      await expect(await attributesPage.attributesRows.count()).toEqual(1);
      await attributesPage.valueRequiredCheckbox.waitFor({
        state: "visible",
        timeout: 10000,
      });
      await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
      await expect(attributesPage.attrVisibleInStorefrontSwitch).toBeChecked();
      await expect(attributesPage.valueRequiredCheckbox).toBeChecked();
    });
  }
}

const SALEOR_125_uuid = faker.datatype.uuid();

for (const attr of attributeClasses) {
  for (const type of ATTRIBUTES.attributeTypesWithoutAbilityToAddValues.names) {
    const uniqueSlug = `${attr}-${type}-${SALEOR_125_uuid}`.replace(/\s+/g, "-");

    test(`TC: SALEOR_125 User should be able to create ${attr} ${type} attribute without ability to add values, NOT required, private @e2e @attributes`, async ({
      page,
    }) => {
      await page.context().storageState({ path: "./playwright/.auth/admin.json" });
      await configurationPage.goToConfigurationView();
      await configurationPage.openAttributes();
      await attributesPage.waitForDOMToFullyLoad();
      await attributesPage.clickCreateAttributeButton();
      await attributesPage.selectAttributeType(attr);
      await attributesPage.typeAttributeDefaultLabel(`${attr} - ${type}`);
      await attributesPage.fillAttributeSlug(uniqueSlug);
      await attributesPage.selectAttributeInputType(type);
      await expect(attributesPage.attrValuesSection).not.toBeVisible();
      await expect(attributesPage.assignAttributeValueButton).not.toBeVisible();
      await attributesPage.clickValueRequiredCheckbox();
      await attributesPage.changeAttributeVisibility();
      await attributesPage.waitForNetworkIdleAfterAction(() => attributesPage.clickSaveButton());
      await attributesPage.expectSuccessBanner();
      await attributesPage.valueRequiredCheckbox.waitFor({
        state: "visible",
        timeout: 10000,
      });
      await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
      await expect(attributesPage.attrVisibleInStorefrontSwitch).not.toBeChecked();
      await expect(attributesPage.valueRequiredCheckbox).not.toBeChecked();
    });
  }
}

const SALEOR_126_uuid = faker.datatype.uuid();

for (const attr of attributeClasses) {
  for (const entity of ATTRIBUTES.attributeReferencesEntities.names) {
    const uniqueSlug = `${attr}-${entity}-${SALEOR_126_uuid}`.replace(/\s+/g, "-");

    test(`TC: SALEOR_126 User should be able to create ${attr} References attribute for ${entity}, NOT required, public @e2e @attributes`, async ({
      page,
    }) => {
      await page.context().storageState({ path: "./playwright/.auth/admin.json" });
      await configurationPage.goToConfigurationView();
      await configurationPage.openAttributes();
      await attributesPage.waitForDOMToFullyLoad();
      await attributesPage.clickCreateAttributeButton();
      await attributesPage.selectAttributeType(attr);
      await attributesPage.typeAttributeDefaultLabel(`${attr} - REFERENCES for ${entity}`);
      await attributesPage.fillAttributeSlug(uniqueSlug);
      await attributesPage.selectAttributeInputType("REFERENCE");
      await attributesPage.selectAttributeEntityType(entity);
      await attributesPage.clickValueRequiredCheckbox();
      await attributesPage.waitForNetworkIdleAfterAction(() => attributesPage.clickSaveButton());
      await attributesPage.expectSuccessBanner();
      await attributesPage.valueRequiredCheckbox.waitFor({
        state: "visible",
        timeout: 10000,
      });
      await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
      await expect(attributesPage.attrVisibleInStorefrontSwitch).toBeChecked();
      await expect(attributesPage.valueRequiredCheckbox).not.toBeChecked();
    });
  }
}

const productAttrWithValues = {
  id: ATTRIBUTES.productAttributeWithValuesToBeUpdated.id,
  name: ATTRIBUTES.productAttributeWithValuesToBeUpdated.name,
  valueToBeDeleted: ATTRIBUTES.productAttributeWithValuesToBeUpdated.valueToBeDeleted,
  valueToBeUpdated: ATTRIBUTES.productAttributeWithValuesToBeUpdated.valueToBeUpdated,
};
const contentAttrWithValues = {
  id: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.id,
  name: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.name,
  valueToBeDeleted: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.valueToBeDeleted,
  valueToBeUpdated: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.valueToBeUpdated,
};
const attributesWithValuesToBeUpdated = [productAttrWithValues, contentAttrWithValues];

for (const attribute of attributesWithValuesToBeUpdated) {
  test(`TC: SALEOR_127 User should be able to update attribute values in existing ${attribute.name} attribute @e2e @attributes`, async () => {
    await attributesPage.waitForNetworkIdleAfterAction(() =>
      attributesPage.gotoExistingAttributePage(attribute.id, attribute.name),
    );
    await attributesPage.clickDeleteAttrValueButton(attribute.valueToBeDeleted);
    await expect(attributesPage.dialog).toBeVisible();
    await attributesPage.deleteAttributeValueDialog.deleteAttributeValue();
    await attributesPage.clickOnExistingAttrValue(attribute.valueToBeUpdated);
    await expect(attributesPage.editAttrValueDialog).toBeVisible();
    await attributesPage.editAttributeValueDialog.provideNewAttributeValue(
      `updated value for ${attribute.name}`,
    );
    await attributesPage.editAttributeValueDialog.saveNewAttributeValue();
    await attributesPage.clickAssignAttributeValueButton();
    await attributesPage.addValueDialog.typeAndSaveAttributeValue(
      `new value for ${attribute.name}`,
    );
    await attributesPage.expectSuccessBanner();
    await attributesPage.waitForNetworkIdleAfterAction(() => attributesPage.clickSaveButton());
    await attributesPage.expectSuccessBanner();
    await expect(attributesPage.attrValuesSection).not.toContainText(attribute.valueToBeDeleted);
    await expect(attributesPage.attrValuesSection).toContainText(
      `updated value for ${attribute.name}`,
    );
    await expect(attributesPage.attrValuesSection).toContainText(`new value for ${attribute.name}`);
  });
}

for (const attr of ATTRIBUTES.attributesToBeUpdated) {
  test(`TC: SALEOR_128 User should be able to edit existing ${attr.name} attribute @e2e @attributes`, async () => {
    await attributesPage.waitForNetworkIdleAfterAction(() =>
      attributesPage.gotoExistingAttributePage(attr.id, attr.name),
    );
    await attributesPage.attributeDefaultLabelInput.clear();
    await attributesPage.typeAttributeDefaultLabel(`updated ${attr.name}`);
    await attributesPage.expandMetadataSection();
    await attributesPage.metadataAddFieldButton.click();
    await attributesPage.fillMetadataFields("new key", "new value");
    await attributesPage.waitForNetworkIdleAfterAction(() => attributesPage.clickSaveButton());
    await attributesPage.expectSuccessBanner();
    await attributesPage.expectElementIsHidden(attributesPage.successBanner);
    await attributesPage.attributeSelect.waitFor({ state: "visible" });
    await expect(attributesPage.attributeSelect).toHaveAttribute("aria-disabled", "true");
    await expect(attributesPage.metadataKeyInput).toHaveValue("new key");
    await expect(attributesPage.metadataValueInput).toHaveValue("new value");
    await expect(attributesPage.attributeDefaultLabelInput).toHaveValue(`updated ${attr.name}`);
  });
}

const productAttribute = {
  id: ATTRIBUTES.productAttributeToBeDeleted.id,
  name: ATTRIBUTES.productAttributeToBeDeleted.name,
};
const contentAttribute = {
  id: ATTRIBUTES.contentAttributeToBeDeleted.id,
  name: ATTRIBUTES.contentAttributeToBeDeleted.name,
};
const attributesToBeDeleted = [productAttribute, contentAttribute];

for (const attribute of attributesToBeDeleted) {
  test(`TC: SALEOR_129 Delete a single ${attribute.name} @e2e @attributes`, async () => {
    await attributesPage.gotoExistingAttributePage(attribute.id, attribute.name);
    await attributesPage.clickDeleteButton();
    await attributesPage.dialog.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await attributesPage.waitForNetworkIdleAfterAction(() =>
      attributesPage.deleteAttributeDialog.deleteAttribute(),
    );
    await attributesPage.waitForGrid();
    await expect(attributesPage.gridCanvas).not.toContainText(attribute.name);
  });
}

test("TC: SALEOR_130 Bulk delete attributes @e2e @attributes", async () => {
  await attributesPage.gotoListView();
  await attributesPage.searchAndFindRowIndexes("e2e attribute to be bulk deleted");
  await attributesPage.clickGridCell(0, 0);
  await attributesPage.clickGridCell(0, 1);
  await attributesPage.clickGridCell(0, 2);
  await attributesPage.clickBulkDeleteGridRowsButton();
  await attributesPage.waitForNetworkIdleAfterAction(() =>
    attributesPage.deleteAttributesInBulkDialog.deleteSelectedAttributes(),
  );
  await attributesPage.expectSuccessBanner();
  await expect(attributesPage.emptyDataGridListView).toBeVisible();
});
