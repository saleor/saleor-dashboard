import { MailpitService } from "@api/mailpit";
import { GIFT_CARDS } from "@data/e2eTestData";
import { GiftCardsPage } from "@pages/giftCardsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let giftCardsPage: GiftCardsPage;
let mailpitService: MailpitService;

test.beforeEach(async ({ page, request }) => {
  test.slow();
  giftCardsPage = new GiftCardsPage(page);
  mailpitService = new MailpitService(request);
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.waitForDOMToFullyLoad();
});
test("TC: SALEOR_105 Issue gift card @e2e @gift", async () => {
  await giftCardsPage.clickIssueCardButton();
  await expect(giftCardsPage.issueGiftCardDialog.amountDropdown).toBeVisible();
  await giftCardsPage.issueGiftCardDialog.typeAmount("50");
  await giftCardsPage.issueGiftCardDialog.typeCustomTag("super ultra automation discount");
  await giftCardsPage.issueGiftCardDialog.tagsInputBlur();
  await giftCardsPage.issueGiftCardDialog.clickRequiresActivationCheckbox();
  await giftCardsPage.issueGiftCardDialog.clickIssueButton();
  await expect(giftCardsPage.issueGiftCardDialog.cardCode).toBeVisible();

  const code = (await giftCardsPage.issueGiftCardDialog.cardCode.innerText()).slice(-4);

  await giftCardsPage.issueGiftCardDialog.clickCopyCodeButton();
  await giftCardsPage.expectSuccessBanner();
  await giftCardsPage.issueGiftCardDialog.clickOkButton();
  await giftCardsPage.giftCardDialog.waitFor({ state: "hidden" });
  await giftCardsPage.expectSuccessBannerMessage("Successfully created gift card");
  await giftCardsPage.successBanner.first().waitFor({
    state: "hidden",
    timeout: 30000,
  });
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.gridCanvas
    .getByText(`Code ending with ${code}`)
    .waitFor({ state: "attached", timeout: 30000 });
});
test("TC: SALEOR_106 Issue gift card with specific customer and expiry date @e2e @gift", async () => {
  await giftCardsPage.clickIssueCardButton();

  await giftCardsPage.issueGiftCardDialog.clickSendExpireDateCheckbox();
  await giftCardsPage.issueGiftCardDialog.typeExpiryPeriodAmount("2");
  await giftCardsPage.issueGiftCardDialog.clickSendToCustomerCheckbox();
  await giftCardsPage.issueGiftCardDialog.selectCustomer("e2e-customer to-be-activated");
  await giftCardsPage.issueGiftCardDialog.clickIssueButton();
  await expect(giftCardsPage.issueGiftCardDialog.cardCode).toBeVisible();

  const fullCode = await giftCardsPage.issueGiftCardDialog.cardCode.innerText();

  await giftCardsPage.issueGiftCardDialog.clickOkButton();
  await giftCardsPage.giftCardDialog.waitFor({ state: "hidden" });
  await giftCardsPage.expectSuccessBannerMessage("Successfully created gift card");
  await giftCardsPage.successBanner.waitFor({
    state: "hidden",
    timeout: 30000,
  });
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.searchAndFindRowIndexes(fullCode);
  expect(
    await giftCardsPage.gridCanvas.locator("table tbody tr").count(),
    "There should be only one gift card visible on list",
  ).toEqual(1);
});
test("TC: SALEOR_107 Resend code @e2e @gift", async () => {
  await giftCardsPage.clickListRowBasedOnContainingText(GIFT_CARDS.giftCardToResendCode.name);
  await giftCardsPage.clickResendCodeButton();
  // This is a workaround for the issue with the dropdown focusing on dialog open
  // Dropdown can cover the resend button and cause test to fail
  await giftCardsPage.resendGiftCardCodeDialog.blur();
  await giftCardsPage.resendGiftCardCodeDialog.clickResendButton();
  await giftCardsPage.expectSuccessBanner();
});
test("TC: SALEOR_108 Deactivate gift card @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(GIFT_CARDS.giftCardToBeDeactivated.id);
  await giftCardsPage.clickDeactivateButton();
  await giftCardsPage.expectSuccessBanner();
  await expect(giftCardsPage.pageHeader).toContainText("Disabled");
});
test("TC: SALEOR_109 Activate gift card @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(GIFT_CARDS.giftCardToBeActivated.id);
  await giftCardsPage.clickDeactivateButton();
  await giftCardsPage.expectSuccessBanner();
  await expect(giftCardsPage.pageHeader).not.toContainText("Disabled");
});
test("TC: SALEOR_110 Edit gift card @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(GIFT_CARDS.giftCardToBeEdited.id);
  await giftCardsPage.openTagInput();
  await giftCardsPage.selectFirstTag();
  await giftCardsPage.selectFirstTag();
  await giftCardsPage.closeTagInput();
  await giftCardsPage.clickCardExpiresCheckbox();
  await giftCardsPage.metadataSeoPage.expandAndAddAllMetadata();
  await giftCardsPage.clickSaveButton();
  await giftCardsPage.expectSuccessBanner();
});
test("TC: SALEOR_111 Bulk delete gift cards @e2e @gift", async () => {
  await giftCardsPage.checkListRowsBasedOnContainingText(GIFT_CARDS.giftCardsToBeDeleted.names);
  await giftCardsPage.clickBulkDeleteButton();
  await giftCardsPage.deleteDialog.clickConfirmDeletionCheckbox();
  await giftCardsPage.deleteDialog.clickDeleteButton();
  await giftCardsPage.dialog.waitFor({ state: "hidden" });
  await giftCardsPage.gotoGiftCardsListView();
  for (const last4Code of GIFT_CARDS.giftCardsToBeDeleted.last4) {
    await expect(giftCardsPage.gridCanvas).not.toContainText(`Code ending with ${last4Code}`);
  }
});
test("TC: SALEOR_181 Set gift card balance @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(GIFT_CARDS.giftCardToBeEdited.id);
  await giftCardsPage.clickSetBalance();
  await giftCardsPage.setGiftCardsBalanceDialog.setBalance("34");
  await giftCardsPage.expectSuccessBanner();
});
test("TC: SALEOR_182 Export gift card codes in XLSX file @e2e @gift", async () => {
  await giftCardsPage.clickShowMoreMenu();
  await giftCardsPage.clickExportGiftCards();
  await giftCardsPage.exportGiftCardsDialog.exportGiftCardCodes("XLSX");
  await giftCardsPage.exportGiftCardsBanner.waitFor({
    state: "hidden",
    timeout: 30000,
  });
  await mailpitService.checkDoesUserReceivedExportedData(
    process.env.E2E_USER_NAME!,
    "Your exported gift cards data is ready",
  );
});
test("TC: SALEOR_183 Export gift card codes in CSV file @e2e @gift", async () => {
  await giftCardsPage.clickShowMoreMenu();
  await giftCardsPage.clickExportGiftCards();
  await giftCardsPage.exportGiftCardsDialog.exportGiftCardCodes("CSV");
  await giftCardsPage.exportGiftCardsBanner.waitFor({
    state: "hidden",
    timeout: 30000,
  });
  await mailpitService.checkDoesUserReceivedExportedData(
    process.env.E2E_USER_NAME!,
    "Your exported gift cards data is ready",
  );
});
