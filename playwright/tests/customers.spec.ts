import { CustomersPage } from "@pages/customersPage";
import { expect, test } from "@playwright/test";
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
  const email = faker.internet.email()
  const note =faker.lorem.sentence()
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