import { CustomersPage } from "@pages/customersPage";
import { test, expect, Page } from "@playwright/test";
import * as faker from "faker";
import { CUSTOMERS, CUSTOMER_ADDRESS } from "@data/e2eTestData";
import data from ".auth/admin.json";
import { GiftCardsPage } from "@pages/giftCardsPage";

test.use({ storageState: "playwright/.auth/admin.json" });
let customersPage: CustomersPage;
let giftCardPage: GiftCardsPage;

test.beforeEach(({ page }) => {
  customersPage = new CustomersPage(page);
  giftCardPage = new GiftCardsPage(page);
});

test("TC: SALEOR_119 Create customer @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const note = faker.lorem.sentence();
  await customersPage.goToCustomersListView();
  await customersPage.clickOnCreateCustomer();
  await customersPage.fillFirstAndLastName(firstName, lastName);
  await customersPage.fillEmail(email);
  await customersPage.fillAddress(CUSTOMER_ADDRESS.createCustomerAddress);
  await customersPage.fillNote(note);
  await customersPage.saveCustomer();
  await customersPage.successBanner.waitFor({ state: "visible" });
  await expect(customersPage.pageHeader).toContainText(
    `${firstName} ${lastName}`,
  );
  await expect(customersPage.customerNoteInput).toContainText(note);
  await expect(customersPage.customerFirstNameInput).toHaveValue(firstName);
  await expect(customersPage.customerLastNameInput).toHaveValue(lastName);
  await expect(customersPage.customerEmailInput).toHaveValue(
    email.toLowerCase(),
  );
});

test("TC: SALEOR_120 Delete customer @e2e @customer", async ({ context }) => {
  await customersPage.gotoCustomerDetailsPage(
    CUSTOMERS.deleteCustomer.id,
    CUSTOMERS.deleteCustomer.email,
  );
  await customersPage.deleteCustomer();
  await customersPage.deleteDialog.clickDeleteButton();
  await customersPage.successBanner.waitFor({ state: "visible" });

  const url = process.env.API_URI ? process.env.API_URI : "";
  const headers = { Authorization: `Token ${data.cookies[0].value}` };
  const getCustomerRequest = await context.request.post(url, {
    data: {
      query: `query{
      user(id:"${CUSTOMERS.deleteCustomer.id}"){
        email
      }
    }`,
    },
    headers,
    failOnStatusCode: false,
  });
  expect(getCustomerRequest.status()).toEqual(404);
});
test("TC: SALEOR_121 Update customer account info @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const note = faker.lorem.sentence();
  await customersPage.gotoCustomerDetailsPage(
    CUSTOMERS.editCustomer.id,
    CUSTOMERS.editCustomer.email,
  );
  await customersPage.fillNote(note);
  await customersPage.fillFirstAndLastName(firstName, lastName);
  await customersPage.fillEmail(email);
  await customersPage.saveCustomer();
  await customersPage.successBanner.waitFor({ state: "visible" });
  await expect(customersPage.pageHeader).toContainText(
    `${firstName} ${lastName}`,
  );
  await expect(customersPage.customerNoteInput).toContainText(note);
  await expect(customersPage.customerFirstNameInput).toHaveValue(firstName);
  await expect(customersPage.customerLastNameInput).toHaveValue(lastName);
  await expect(customersPage.customerEmailInput).toHaveValue(
    email.toLowerCase(),
  );
});
test("TC: SALEOR_122 issue a new gift card @e2e @customer", async () => {
  const amount = faker.datatype.number(1000).toPrecision(2).toString();
  await customersPage.gotoCustomerDetailsPage(
    CUSTOMERS.editCustomer.id,
    CUSTOMERS.editCustomer.email,
  );
  await customersPage.clickIssueNewGiftCard();
  await customersPage.issueGiftCardDialog.typeAmount(amount);
  await customersPage.issueGiftCardDialog.typeTag(faker.lorem.word());
  await customersPage.issueGiftCardDialog.typeNote(faker.lorem.sentences(3));
  await customersPage.issueGiftCardDialog.clickIssueButton();
  await customersPage.successBanner.waitFor({ state: "visible" });
  const giftCardCode =
    await customersPage.issueGiftCardDialog.getGiftCardCode();
  await giftCardPage.gotoGiftCardsListView();
  await giftCardPage.typeInSearchOnListView(giftCardCode);
  await giftCardPage.waitForGrid();
  expect(await giftCardPage.getNumberOfGridRows()).toBe(2);
});
test("TC: SALEOR_123 Update address information @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(
    CUSTOMERS.editCustomer.id,
    CUSTOMERS.editCustomer.email,
  );
  await customersPage.clickMenageAddresses();
  await customersPage.clickShowMoreMenu();
  await customersPage.clickEditAddress();
  await customersPage.addressDialog.completeAddressFormAllFields(
    CUSTOMER_ADDRESS.editCustomerAddress,
  );
  await customersPage.successBanner.waitFor({ state: "visible" });
  // await expect(customersPage.addressesListPage.lastNameField).toContainText(
    // CUSTOMER_ADDRESS.editCustomerAddress.lastName,
  // );
  await expect(customersPage.addressesListPage.companyNameField).toContainText(
    CUSTOMER_ADDRESS.editCustomerAddress.companyName,
  );
  await expect(customersPage.addressesListPage.phoneField).toContainText(
    CUSTOMER_ADDRESS.editCustomerAddress.phone,
  );
  await expect(customersPage.addressesListPage.addressLinesField).toContainText(
    CUSTOMER_ADDRESS.editCustomerAddress.addressLine1
  )
  await expect(customersPage.addressesListPage.addressLinesField).toContainText(
    CUSTOMER_ADDRESS.editCustomerAddress.addressLine2,
  );
  await expect(
    customersPage.addressesListPage.postalCodeAndCityField,
  ).toContainText(
    CUSTOMER_ADDRESS.editCustomerAddress.zip
  );
  await expect(
    customersPage.addressesListPage.postalCodeAndCityField,
  ).toContainText(
    CUSTOMER_ADDRESS.editCustomerAddress.cityName,
  );
  await expect(
    customersPage.addressesListPage.countryAreaAndCountryField,
  ).toContainText(CUSTOMER_ADDRESS.editCustomerAddress.country);
});
