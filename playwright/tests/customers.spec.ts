import { ADDRESS } from "@data/addresses";
import { CUSTOMERS } from "@data/e2eTestData";
import { AddressesListPage } from "@pages/addressesListPage";
import { CustomersPage } from "@pages/customersPage";
import { AddAddressDialog } from "@pages/dialogs/addAddressDialog";
import { DeleteAddressDialog } from "@pages/dialogs/deleteAddressDialog";
import { AddressForm } from "@pages/forms/addressForm";
import { GiftCardsPage } from "@pages/giftCardsPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let customersPage: CustomersPage;
let giftCardsPage: GiftCardsPage;
let addressesListPage: AddressesListPage;
let addressForm: AddressForm;
let deleteAddressDialog: DeleteAddressDialog;
let addAddressDialog: AddAddressDialog;

test.beforeEach(({ page }) => {
  customersPage = new CustomersPage(page);
  giftCardsPage = new GiftCardsPage(page);
  addressesListPage = new AddressesListPage(page);
  addressForm = new AddressForm(page);
  addAddressDialog = new AddAddressDialog(page);
  deleteAddressDialog = new DeleteAddressDialog(page);
});

test("TC: SALEOR_199 Create customer @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const note = faker.lorem.sentence();
  const email = faker.internet.email();

  await customersPage.goToCustomersListView();
  await customersPage.clickOnCreateCustomer();
  await customersPage.fillFirstAndLastName(firstName, lastName);
  await customersPage.fillEmail(email);

  const newAddress = ADDRESS.addressUS;

  await addressForm.completeBasicInfoAddressForm(newAddress);
  await addressForm.typeCompanyName(newAddress.companyName);
  await addressForm.typePhone(newAddress.phone);
  await addressForm.typeAddressLine2(newAddress.addressLine2);
  await addressForm.selectCountryArea(newAddress.countryArea);
  await customersPage.fillNote(note);
  await customersPage.saveCustomer();
  await customersPage.expectSuccessBanner();
  await expect(customersPage.pageHeader).toContainText(`${firstName} ${lastName}`);
  await expect(customersPage.customerNoteInput).toContainText(note);
  await expect(customersPage.customerFirstNameInput).toHaveValue(firstName);
  await expect(customersPage.customerLastNameInput).toHaveValue(lastName);
  await expect(customersPage.customerEmailInput).toHaveValue(email.toLowerCase());
});

test("TC: SALEOR_200 As an admin I should not be able to create customer with duplicated email @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const note = faker.lorem.sentence();

  await customersPage.goToCustomersListView();
  await customersPage.clickOnCreateCustomer();
  await customersPage.fillFirstAndLastName(firstName, lastName);
  await customersPage.fillEmail(CUSTOMERS.customerToBeDeactivated.email);

  const newAddress = ADDRESS.addressUS;

  await addressForm.completeBasicInfoAddressForm(newAddress);
  await addressForm.typeCompanyName(newAddress.companyName);
  await addressForm.typePhone(newAddress.phone);
  await addressForm.typeAddressLine2(newAddress.addressLine2);
  await addressForm.selectCountryArea(newAddress.countryArea);
  await customersPage.fillNote(note);
  await customersPage.saveCustomer();
  await customersPage.expectErrorBannerMessage("User with this Email already exists.");
});

test("TC: SALEOR_201 Update customer account info @e2e @customer", async () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const note = faker.lorem.sentence();

  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await customersPage.fillNote(note);
  await customersPage.fillFirstAndLastName(firstName, lastName);
  await customersPage.fillEmail(email);
  await customersPage.saveCustomer();
  await customersPage.expectSuccessBanner();
  await expect(customersPage.pageHeader).toContainText(`${firstName} ${lastName}`);
  await expect(customersPage.customerNoteInput).toContainText(note);
  await expect(customersPage.customerFirstNameInput).toHaveValue(firstName);
  await expect(customersPage.customerLastNameInput).toHaveValue(lastName);
  await expect(customersPage.customerEmailInput).toHaveValue(email.toLowerCase());
});

test("TC: SALEOR_202 Deactivate a customer @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.customerToBeDeactivated.id);
  await customersPage.customerActiveCheckbox.click();
  await customersPage.saveCustomer();
  await customersPage.expectSuccessBanner();
  await expect(customersPage.customerActiveCheckbox).not.toBeChecked();
});

test("TC: SALEOR_203 Activate a customer @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.customerToBeActivated.id);
  await customersPage.customerActiveCheckbox.click();
  await customersPage.saveCustomer();
  await customersPage.expectSuccessBanner();
  await expect(customersPage.customerActiveCheckbox).toBeChecked();
});

test("TC: SALEOR_204 Delete customer from the details page @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.deleteCustomer.id);
  await customersPage.deleteCustomer();
  await customersPage.deleteDialog.clickDeleteButton();
  await customersPage.expectSuccessBanner();
  await customersPage.goToCustomersListView();
  await customersPage.searchForCustomer(CUSTOMERS.deleteCustomer.email);
  await expect(customersPage.emptyDataGridListView).toBeVisible();
});

test("TC: SALEOR_205 Bulk delete customers @e2e @customer", async () => {
  const customersToBeBulkDeleted = CUSTOMERS.customersToBeBulkDeleted.names;

  await customersPage.goToCustomersListView();
  await customersPage.searchAndFindRowIndexes("bulk-delete");
  await customersPage.waitForGrid();

  const rowsToCheck = [0, 1, 2];

  await customersPage.checkGridCellTextAndClick(0, rowsToCheck, customersToBeBulkDeleted);
  await customersPage.clickBulkDeleteGridRowsButton();
  await customersPage.deleteDialog.clickDeleteButton();
  await customersPage.expectSuccessBanner();
  await expect(customersPage.emptyDataGridListView).toBeVisible();
});

test("TC: SALEOR_206 As an admin I want to add address to the customer and set it as default shipping @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await addressesListPage.clickManageAddresses();
  await addressesListPage.clickAddAddressButton();

  const addressUK = ADDRESS.addressUK;

  await addressForm.completeBasicInfoAddressForm(addressUK);
  await addressForm.typeCompanyName(addressUK.companyName);
  await addressForm.typePhone(addressUK.phone);
  await addressForm.typeAddressLine2(addressUK.addressLine2);
  await addAddressDialog.clickConfirmButton();

  const addedAddress = addressesListPage.savedAddress.filter({
    hasText: addressUK.lastName,
  });
  const addedAddressCard = addressesListPage.addressCard.filter({
    hasText: addressUK.lastName,
  });

  await expect(addedAddress).toBeVisible();
  await addressesListPage.clickShowMoreMenu(addressUK.lastName);
  await addressesListPage.setAsDeafultShippingAddress();
  await expect(addedAddressCard.locator(addressesListPage.addressTypeTitle)).toHaveText(
    "Default Shipping Address",
  );
});

test("TC: SALEOR_209 As an admin I want to update customer's address and set it as default billing @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await addressesListPage.clickManageAddresses();
  await addressesListPage.clickShowMoreMenu(CUSTOMERS.editCustomer.initialShippingAddress.lastName);
  await addressesListPage.clickEditAddress();

  const newAddress = ADDRESS.addressUS;

  await addressForm.completeBasicInfoAddressForm(newAddress);
  await addressForm.typeCompanyName(newAddress.companyName);
  await addressForm.typePhone(newAddress.phone);
  await addressForm.typeAddressLine2(newAddress.addressLine2);
  await addressForm.selectCountryArea(newAddress.countryArea);
  await addAddressDialog.clickConfirmButton();
  await customersPage.expectSuccessBanner();
  await addressesListPage.verifyRequiredAddressFields(newAddress.firstName, newAddress);
  await addressesListPage.verifyPhoneField(newAddress.firstName, newAddress);
  await addressesListPage.verifyCompanyField(newAddress.firstName, newAddress);
  await addressesListPage.verifyAddressLine2Field(newAddress.firstName, newAddress);

  const additionalAddressCard = addressesListPage.addressCard.filter({
    hasText: CUSTOMERS.editCustomer.additionalAddress.lastName,
  });

  await addressesListPage.clickShowMoreMenu(CUSTOMERS.editCustomer.additionalAddress.lastName);
  await addressesListPage.setAsDeafultBillingAddress();
  await expect(additionalAddressCard.locator(addressesListPage.addressTypeTitle)).toHaveText(
    "Default Billing Address",
  );
});

test("TC: SALEOR_210 Delete customer's address @e2e @customer", async () => {
  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await addressesListPage.clickManageAddresses();
  await addressesListPage.clickShowMoreMenu(CUSTOMERS.editCustomer.initialBillingAddress.lastName);
  await addressesListPage.clickDeleteAddress();
  await deleteAddressDialog.clickDeleteButton();
  await expect(
    addressesListPage.savedAddress.filter({
      hasText: CUSTOMERS.editCustomer.initialBillingAddress.lastName,
    }),
  ).not.toBeVisible();
});

test("TC: SALEOR_207 Issue a new gift card for the customer @e2e @customer", async () => {
  const amount = faker.datatype.number(1000).toPrecision(2).toString();

  await customersPage.gotoCustomerDetailsPage(CUSTOMERS.editCustomer.id);
  await customersPage.clickIssueNewGiftCard();

  await expect(customersPage.amountDropdown).toBeVisible();
  await customersPage.issueGiftCardDialog.typeAmount(amount);
  await customersPage.issueGiftCardDialog.typeCustomTag(faker.lorem.word());
  await customersPage.issueGiftCardDialog.typeNote(faker.lorem.sentences(3));
  await customersPage.issueGiftCardDialog.clickIssueButton();
  await customersPage.expectSuccessBanner();
  await expect(giftCardsPage.issueGiftCardDialog.cardCode).toBeVisible();

  const code = (await giftCardsPage.issueGiftCardDialog.cardCode.innerText()).slice(-4);

  await giftCardsPage.issueGiftCardDialog.clickCopyCodeButton();
  await giftCardsPage.expectSuccessBanner();
  await giftCardsPage.issueGiftCardDialog.clickOkButton();
  await giftCardsPage.expectElementIsHidden(giftCardsPage.giftCardDialog);
  await giftCardsPage.expectSuccessBannerMessage("Successfully created gift card");
  await giftCardsPage.expectElementIsHidden(giftCardsPage.successBanner);
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.waitForCanvasContainsText(`Code ending with ${code}`);
});
