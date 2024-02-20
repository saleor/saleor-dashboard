import { CustomersPage } from "@pages/customersPage";
import { test } from "@playwright/test";
import * as faker from 'faker';
import { CUSTOMERS, CUSTOMER_ADDRESS } from "@data/e2eTestData";


test.use({ storageState: "playwright/.auth/admin.json" });
let customersPage: CustomersPage;

test.beforeEach(({ page }) => {
  customersPage = new CustomersPage(page);
});

test("TC: SALEOR_119 Create customer @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const note = faker.lorem.sentence();
  await customersPage.goToCustomersListView();
  await customersPage.clickOnCreateCustomer()
  await customersPage.fillName(firstName, lastName)
  await customersPage.fillEmail(email);
  await customersPage.fillAddress(CUSTOMER_ADDRESS.createCustomerAddress);
  await customersPage.fillNote(note)
  await customersPage.saveCustomer();
  await customersPage.successBanner.waitFor({state:"visible"})
});
test("TC: SALEOR_120 Delete customer @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.deleteCustomer.id)
  await customersPage.deleteCustomer();
  await customersPage.deleteDialog.clickDeleteButton();
  await customersPage.successBanner.waitFor({ state: "visible" });
});
test("TC: SALEOR_121 Update customer account info @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const note = faker.lorem.sentence();
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await customersPage.fillNote(note)
  await customersPage.fillName(firstName, lastName)
  await customersPage.fillEmail(email)
  await customersPage.saveCustomer();
  await customersPage.successBanner.waitFor({ state: "visible" });
});
test("TC: SALEOR_122 issue a new gift card @e2e @customer", async () => {
  const amount = faker.datatype.number(1000).toPrecision(2).toString();
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await customersPage.clickIssueNewGiftCard();
  await customersPage.issueGiftCardDialog.typeAmount(amount)
  await customersPage.issueGiftCardDialog.typeTag(faker.lorem.word())
  await customersPage.issueGiftCardDialog.typeNote(faker.lorem.sentences(3))
  await customersPage.issueGiftCardDialog.clickIssueButton()
  await customersPage.successBanner.waitFor({ state: "visible" });
});
test("TC: SALEOR_123 Update address information @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await customersPage.clickMenageAddresses()
  await customersPage.clickShowMoreMenu()
  await customersPage.clickEditAddress()
  await customersPage.addressDialog.completeAddressFormAllFields(CUSTOMER_ADDRESS.editCustomerAddress)
  await customersPage.successBanner.waitFor({ state: "visible" });
});