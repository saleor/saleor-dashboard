import { CHANNELS } from "@data/e2eTestData";
import { URL_LIST } from "@data/url";
import { AddCountriesDialog } from "@dialogs/addCountriesDialog";
import { MetadataSeoPage } from "@pageElements/metadataSeoPage";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class TaxesPage extends BasePage {
  readonly page: Page;
  readonly addCountriesDialog: AddCountriesDialog;
  readonly metadataSeoPage: MetadataSeoPage;

  constructor(
    page: Page,
    readonly appOrFlatRateSelect = page
      .getByTestId("app-flat-select")
      .locator("[role='button']"),
    readonly chanelListRow = page.getByTestId("channels-list-rows"),
    readonly countriesListRow = page.getByTestId("countries-list-rows"),
    readonly classListRow = page.getByTestId("class-list-rows"),
    readonly countriesTab = page.getByTestId("countries-tab"),
    readonly taxClassTab = page.getByTestId("tax-classes-tab"),
    readonly enteredRenderedSection = page.getByTestId(
      "entered-rendered-prices-section",
    ),
    readonly pricesEnteredWithTaxButton = page.locator(
      "[name='pricesEnteredWithTax'][ value='true']",
    ),
    readonly pricesEnteredWithoutTaxButton = page.locator(
      "[name='pricesEnteredWithTax'][ value='false']",
    ),
    readonly displayGrossPricesCheckbox = page.locator(
      "[name='displayGrossPrices']",
    ),
    readonly addCountryButton = page.getByTestId("add-country-button"),
    readonly createClassButton = page.getByTestId("create-class-button"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly exceptionCountryRows = page.getByTestId("exception-country"),
    readonly exceptionCountryGrossPriceCheckbox = page.getByTestId(
      "display-gross-prices-checkbox",
    ),
    readonly checkBoxCheckedState = page.locator("Mui-checked"),
    readonly exceptionCountriesCheckBoxCheckedState = page.locator(
      "[class*='Mui-checked']",
    ),
    readonly searchTaxClassInput = page
      .getByTestId("search-tax-class-input")
      .locator("input"),
    readonly searchedCountryRows = page.getByTestId("country-rows"),

    readonly searchTaxCountryInput = page
      .getByTestId("search-tax-countries-input")
      .locator("input"),
    readonly taxClassNameInput = page
      .getByTestId("class-name-input")
      .locator("input"),
    readonly noTaxRateInput = page.getByTestId("No Taxes").locator("input"),
    readonly defaultRateInput = page
      .getByTestId("Country default rate")
      .locator("input"),
    readonly audioProductsRateInput = page
      .getByTestId("Audio Products (tapes, cds etc.)")
      .locator("input"),
    readonly dataServicesRateInput = page
      .getByTestId("Data services - storage and retrieval ")
      .locator("input"),
    readonly standardRateInput = page.getByTestId("standard").locator("input"),
    readonly temporaryUnmappedRateInput = page
      .getByTestId("Temporary Unmapped Other SKU - taxable default")
      .locator("input"),
  ) {
    super(page);
    this.page = page;
    this.addCountriesDialog = new AddCountriesDialog(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
  }

  async clickSelectMethodField() {
    await this.appOrFlatRateSelect.click();
  }

  async typeAllTaxRatesForCountry(
    defaultRate: string,
    noTaxRate: string,
    audioRate: string,
    dataServiceRate: string,
    standardRate: string,
    temporaryRate: string,
  ) {
    await this.defaultRateInput.fill(defaultRate);
    await this.audioProductsRateInput.fill(audioRate);
    await this.dataServicesRateInput.fill(dataServiceRate);
    await this.noTaxRateInput.fill(noTaxRate);
    await this.standardRateInput.fill(standardRate);
    await this.temporaryUnmappedRateInput.fill(temporaryRate);
  }

  async clickCountriesTab() {
    await this.countriesTab.click();
    await this.countriesListRow.first().waitFor({ state: "visible" });
  }

  async clickTaxClassTab() {
    await this.taxClassTab.click();
    await this.classListRow.first().waitFor({ state: "visible" });
  }

  async clickCountryFromList(countryCode: string) {
    await this.countriesListRow.filter({ hasText: countryCode }).click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async typeTaxClassName(taxClassName: string) {
    await this.taxClassNameInput.fill(taxClassName);
  }

  async typeSearchedTaxCountryName(taxCountryName: string) {
    await this.searchTaxCountryInput.fill(taxCountryName);
  }

  async typeTaxRateInSearchedCountryRow(
    taxCountryName: string,
    taxRateValue: string,
  ) {
    await this.searchedCountryRows
      .filter({ hasText: taxCountryName })
      .locator("input")
      .fill(taxRateValue);
  }

  async clickCreateClassButton() {
    await this.createClassButton.click();
  }

  async selectTaxCalculationMethod(method: "FLAT_RATES" | "saleor.app.avatax") {
    await this.clickSelectMethodField();
    await this.page.getByTestId(`select-field-option-${method}`).click();
  }

  async selectPricesWithoutTaxes() {
    await this.enteredRenderedSection
      .locator(this.pricesEnteredWithoutTaxButton)
      .click();
  }

  async selectPricesWithTaxes() {
    await this.enteredRenderedSection
      .locator(this.pricesEnteredWithTaxButton)
      .click();
  }

  async clickShowGrossPricesInStorefront() {
    await this.enteredRenderedSection
      .locator(this.displayGrossPricesCheckbox)
      .click();
  }

  async clickAddCountryButton() {
    await this.addCountryButton.click();
  }

  async selectChannel(channelName: string) {
    await this.chanelListRow.filter({ hasText: channelName }).click();
  }

  async gotoChannelsTabUrl() {
    await this.page.goto(URL_LIST.taxChannel + CHANNELS.plnChannel.id);
  }
}
