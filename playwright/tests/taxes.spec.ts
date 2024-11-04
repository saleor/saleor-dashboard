import { CHANNELS, COUNTRIES } from "@data/e2eTestData";
import { ConfigurationPage } from "@pages/configurationPage";
import { TaxesPage } from "@pages/taxesPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let configurationPage: ConfigurationPage;
let taxesPage: TaxesPage;

test.beforeEach(({ page }) => {
  configurationPage = new ConfigurationPage(page);
  taxesPage = new TaxesPage(page);
});
test("TC: SALEOR_115 Change taxes in channel to use tax app  @taxes @e2e", async () => {
  await configurationPage.goToConfigurationView();
  await configurationPage.openTaxes();
  await taxesPage.selectChannel(CHANNELS.channelForTaxEdition.name);
  await taxesPage.selectTaxCalculationMethod("Saleor Dummy tax app");
  await taxesPage.clickSaveButton();
  await taxesPage.expectSuccessBanner();
});
test("TC: SALEOR_116 Change taxes in channel: enter prices without tax, do not show gross price, add country exception @taxes @e2e", async () => {
  await taxesPage.gotoChannelsTabUrl();
  await taxesPage.selectChannel(CHANNELS.channelForTaxEdition.name);
  await taxesPage.selectPricesWithoutTaxes();
  await taxesPage.clickShowGrossPricesInStorefront();
  await taxesPage.clickAddCountryButton();
  await taxesPage.addCountriesDialog.typeSearchedCountry("Canada");
  await taxesPage.addCountriesDialog.checkAndSaveSingleCountry("Canada");
  await expect(taxesPage.exceptionCountryRows).toContainText("Canada");
  expect(
    await taxesPage.exceptionCountryRows
      .locator(taxesPage.exceptionCountriesCheckBoxCheckedState)
      .count(),
  ).toEqual(1);
  await taxesPage.clickSaveButton();
  await taxesPage.expectSuccessBanner();
});
test("TC: SALEOR_117 Add new country and tax rates to it @taxes @e2e", async () => {
  await taxesPage.gotoChannelsTabUrl();
  await taxesPage.clickCountriesTab();
  await taxesPage.clickAddCountryButton();
  await taxesPage.addCountriesDialog.typeSearchedCountry(COUNTRIES.countryToBeAddedInTaxes.name);
  await taxesPage.addCountriesDialog.checkAndSaveSingleCountry(
    COUNTRIES.countryToBeAddedInTaxes.name,
  );
  expect(await taxesPage.countriesListRow.first()).toHaveText(
    COUNTRIES.countryToBeAddedInTaxes.name,
  );
  await taxesPage.typeAllTaxRatesForCountry("23", "0", "16", "7", "21", "19");
  await taxesPage.clickSaveButton();
  await taxesPage.expectSuccessBanner();
});
test("TC: SALEOR_118 Add new class with metadata and set tax rate for single country @taxes @e2e", async () => {
  await taxesPage.gotoChannelsTabUrl();
  await taxesPage.clickTaxClassTab();
  await taxesPage.clickCreateClassButton();
  expect(await taxesPage.taxClassNameInput).toHaveValue("New tax class");
  await taxesPage.typeTaxClassName("Automation test tax class");
  await taxesPage.typeSearchedTaxCountryName("United States of America");
  await taxesPage.typeTaxRateInSearchedCountryRow("United States of America", "20");
  await taxesPage.metadataSeoPage.expandAndAddAllMetadata();
  await taxesPage.clickSaveButton();
  await taxesPage.expectSuccessBanner();
});
