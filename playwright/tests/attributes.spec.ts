import { AttributesPage } from "@pages/attributesPage";
import { ATTRIBUTES } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { expect, test } from "@playwright/test";
import faker from "faker";

test.use({ storageState: "./playwright/.auth/admin.json" });

let attributesPage: AttributesPage;
let configurationPage: ConfigurationPage;

test.beforeEach(({ page }) => {
  attributesPage = new AttributesPage(page);
  configurationPage = new ConfigurationPage(page);
});

const attributeClasses = ["PRODUCT_TYPE", "PAGE_TYPE"];
for (const attr of attributeClasses) {
const SALEOR_124_uuid = faker.datatype.uuid();
for (const type of ATTRIBUTES.attributeTypesWithAbilityToAddValues.names) {
  const uniqueSlug = `${attr}-${type}-${SALEOR_124_uuid}`;
  test(`TC: SALEOR_124 User should be able to create ${attr} ${type} attribute with ability to add values, required, public @e2e @attributes`, async () => {
    await configurationPage.gotoConfigurationView();
    await configurationPage.openAttributes();
    await attributesPage.clickCreateAttributeButton();
    await attributesPage.selectAttributeType(attr);
    await attributesPage.typeAttributeDefaultLabel(`${attr} - ${type}`);
    await attributesPage.fillAttributeSlug(uniqueSlug);
    await attributesPage.selectAttributeInputType(type);
    await expect(attributesPage.attrValuesSection).toBeVisible();
    await attributesPage.clickAssignAttributeValueButton();
    await attributesPage.addValueDialog.typeAndSaveAttributeValue();
    await attributesPage.clickSaveButton();
    await attributesPage.expectSuccessBanner();
    await expect(await attributesPage.attributesRows.count()).toEqual(1);
    await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
    await expect(attributesPage.attrVisibleInStorefrontSwitch).toBeChecked();
    await expect(attributesPage.valueRequiredCheckbox).toBeChecked();
  });
}
}

const SALEOR_125_uuid = faker.datatype.uuid();
for (const attr of attributeClasses) {
 for (const type of ATTRIBUTES.attributeTypesWithoutAbilityToAddValues.names) {
    const uniqueSlug = `${attr}-${type}-${SALEOR_125_uuid}`;
    test(`TC: SALEOR_125 User should be able to create ${attr} ${type} attribute without ability to add values, NOT required, private @e2e @attributes`, async () => {
      await configurationPage.gotoConfigurationView();
      await configurationPage.openAttributes();
      await attributesPage.clickCreateAttributeButton();
      await attributesPage.selectAttributeType(attr);
      await attributesPage.typeAttributeDefaultLabel(`${attr} - ${type}`);
      await attributesPage.fillAttributeSlug(uniqueSlug);
      await attributesPage.selectAttributeInputType(type);
      await expect(attributesPage.attrValuesSection).not.toBeVisible();
      await expect(attributesPage.assignAttributeValueButton).not.toBeVisible();
      await attributesPage.clickValueRequiredCheckbox();
      await attributesPage.changeAttributeVisibility();
      await attributesPage.clickSaveButton();
      await attributesPage.expectSuccessBanner();
      await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
      await expect(attributesPage.attrVisibleInStorefrontSwitch).not.toBeChecked();
      await expect(attributesPage.valueRequiredCheckbox).not.toBeChecked();
    });
  }
}

const SALEOR_126_uuid = faker.datatype.uuid();
for (const attr of attributeClasses) {
  for (const entity of ATTRIBUTES.attributeReferencesEntities.names)
  {
    const uniqueSlug = `${attr}-${entity}-${SALEOR_126_uuid}`;
    test(`TC: SALEOR_126 User should be able to create ${attr} References attribute for ${entity}, NOT required, public @e2e @attributes`, async () => {
      await configurationPage.gotoConfigurationView();
      await configurationPage.openAttributes();
      await attributesPage.clickCreateAttributeButton();
      await attributesPage.selectAttributeType(attr);
      await attributesPage.typeAttributeDefaultLabel(`${attr} - REFERENCES for ${entity}`);
      await attributesPage.fillAttributeSlug(uniqueSlug);
      await attributesPage.selectAttributeInputType("REFERENCE");
      await attributesPage.selectAttributeEntityType(entity);
      await attributesPage.clickValueRequiredCheckbox();
      await attributesPage.clickSaveButton();
      await attributesPage.expectSuccessBanner();
      await expect(attributesPage.valueRequiredCheckbox).toBeEnabled();
      await expect(attributesPage.attrVisibleInStorefrontSwitch).toBeChecked();
      await expect(attributesPage.valueRequiredCheckbox).not.toBeChecked();
    });
  }
}

const productAttrWithValues = { id: ATTRIBUTES.productAttributeWithValuesToBeUpdated.id, name: ATTRIBUTES.productAttributeWithValuesToBeUpdated.name, valueToBeDeleted: ATTRIBUTES.productAttributeWithValuesToBeUpdated.valueToBeDeleted, valueToBeUpdated: ATTRIBUTES.productAttributeWithValuesToBeUpdated.valueToBeUpdated  }
const contentAttrWithValues = { id: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.id, name: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.name, valueToBeDeleted: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.valueToBeDeleted, valueToBeUpdated: ATTRIBUTES.contentAttributeWithValuesToBeUpdated.valueToBeUpdated }
const attributesWithValuesToBeUpdated = [productAttrWithValues, contentAttrWithValues];
for (const attribute of attributesWithValuesToBeUpdated) {
  test(`TC: SALEOR_127 User should be able to update attribute values in existing ${attribute.name} attribute @e2e @attributes`, async () => {
    await attributesPage.gotoExistingAttributePage(attribute.id, attribute.name)
    await attributesPage.clickDeleteAttrValueButton(attribute.valueToBeDeleted);
    await expect(attributesPage.dialog).toBeVisible();
    await attributesPage.deleteAttributeValueDialog.deleteAttributeValue();
    await attributesPage.clickOnExistingAttrValue(attribute.valueToBeUpdated);
    await expect(attributesPage.editAttrValueDialog).toBeVisible();
    await attributesPage.editAttributeValueDialog.provideNewAttributeValue(`updated value for ${attribute.name}`);
    await attributesPage.editAttributeValueDialog.saveNewAttributeValue();
    await attributesPage.clickAssignAttributeValueButton();
    await attributesPage.addValueDialog.typeAndSaveAttributeValue(`new value for ${attribute.name}`);
    await attributesPage.clickSaveButton();
    await attributesPage.expectSuccessBanner();
    await expect(attributesPage.attrValuesSection).not.toContainText(attribute.valueToBeDeleted);
    await expect(attributesPage.attrValuesSection).toContainText(`updated value for ${attribute.name}`);
    await expect(attributesPage.attrValuesSection).toContainText(`new value for ${attribute.name}`);
});}

for (const attr of ATTRIBUTES.attributesToBeUpdated) {
  test(`TC: SALEOR_128 User should be able to edit existing ${attr.name} attribute @e2e @attributes`, async () => {
  await attributesPage.gotoExistingAttributePage(attr.id, attr.name);
  await attributesPage.attributeDefaultLabelInput.clear();
  await attributesPage.typeAttributeDefaultLabel(`updated ${attr.name}`);
  await attributesPage.expandMetadataSection();
  await attributesPage.metadataAddFieldButton.click();
  await attributesPage.fillMetadataFields("new key", "new value");
  await attributesPage.clickSaveButton();
  await attributesPage.expectSuccessBanner();
  await expect(attributesPage.attributeSelect.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  await expect(attributesPage.metadataKeyInput).toHaveValue("new key");
  await expect(attributesPage.metadataValueInput).toHaveValue("new value");
  await expect(attributesPage.attributeDefaultLabelInput).toHaveValue(`updated ${attr.name}`);
});};

const productAttribute = { id: ATTRIBUTES.productAttributeToBeDeleted.id, name: ATTRIBUTES.productAttributeToBeDeleted.name }
const contentAttribute = { id: ATTRIBUTES.contentAttributeToBeDeleted.id, name: ATTRIBUTES.contentAttributeToBeDeleted.name }
const attributesToBeDeleted = [productAttribute, contentAttribute];
for (const attribute of attributesToBeDeleted) {
  test(`TC: SALEOR_129 Delete a single ${attribute.name} @e2e @attributes`, async () => {
    await attributesPage.gotoExistingAttributePage(attribute.id, attribute.name);
    await attributesPage.clickDeleteButton();
    await attributesPage.dialog.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await attributesPage.deleteAttributeDialog.deleteAttribute();
    await attributesPage.waitForGrid()
    await expect(attributesPage.gridCanvas).not.toContainText(attribute.name);
  });
}

test("TC: SALEOR_130 Bulk delete attributes @e2e @attributes", async () => {
  await attributesPage.gotoListView();
  await attributesPage.resizeWindow(800,600);
  await attributesPage.typeInSearchOnListView("e2e attribute to be bulk deleted")
  await expect(attributesPage.loader).toBeVisible({ timeout: 30000});
  await expect(attributesPage.loader).not.toBeVisible({ timeout: 30000});
  await attributesPage.clickOnSpecificPositionOnPage(60, 136)
  await attributesPage.clickBulkDeleteGridRowsButton();
  await attributesPage.deleteAttributesInBulkDialog.deleteSelectedAttributes();
  await expect(attributesPage.emptyDataGridListView).toBeVisible();
  });
