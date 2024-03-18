import { GIFT_CARDS } from "@data/e2eTestData";
import { GiftCardsPage } from "@pages/giftCardsPage";
import { expect, test } from "@playwright/test";
import { MailpitService } from "@api/mailpit";


test.use({ storageState: "./playwright/.auth/admin.json" });
let giftCardsPage: GiftCardsPage;
let mailpitService: MailpitService;
test.beforeEach(({ page, request }) => {
  giftCardsPage = new GiftCardsPage(page);
  mailpitService = new MailpitService(request);
});

test("TC: SALEOR_105 Issue gift card @e2e @gift", async () => {
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.waitForGrid();
  const numberOfGiftCards = await giftCardsPage.getNumberOfGridRows();
  await giftCardsPage.clickIssueCardButton();
  await giftCardsPage.issueGiftCardDialog.typeAmount("50");
  await giftCardsPage.issueGiftCardDialog.typeTag(
    "super ultra automation discount",
  );
  await giftCardsPage.issueGiftCardDialog.clickRequiresActivationCheckbox();
  await giftCardsPage.issueGiftCardDialog.clickIssueButton();
  await expect(giftCardsPage.issueGiftCardDialog.cardCode).toBeVisible();
  await giftCardsPage.issueGiftCardDialog.clickCopyCodeButton();
  await giftCardsPage.expectSuccessBanner();
  await giftCardsPage.issueGiftCardDialog.clickOkButton();
  await giftCardsPage.waitForGrid();
  const numberOfGiftCardsAfterCreation =
    await giftCardsPage.getNumberOfGridRows();
  expect(numberOfGiftCardsAfterCreation - numberOfGiftCards).toEqual(1);
});
test("TC: SALEOR_106 Issue gift card with specific customer and expiry date @e2e @gift", async () => {
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.waitForGrid();
  const numberOfGiftCards = await giftCardsPage.getNumberOfGridRows();
  await giftCardsPage.clickIssueCardButton();
  await giftCardsPage.issueGiftCardDialog.clickSendToCustomerCheckbox();
  await giftCardsPage.issueGiftCardDialog.typeCustomer("Allison Freeman");
  await giftCardsPage.issueGiftCardDialog.clickSendExpireDateCheckbox();
  await giftCardsPage.issueGiftCardDialog.typeExpiryPeriodAmount("2");
  await giftCardsPage.issueGiftCardDialog.clickIssueButton();
  await expect(giftCardsPage.issueGiftCardDialog.cardCode).toBeVisible();
  await giftCardsPage.issueGiftCardDialog.clickOkButton();
  await giftCardsPage.waitForGrid();
  const numberOfGiftCardsAfterCreation =
    await giftCardsPage.getNumberOfGridRows();
  expect(numberOfGiftCardsAfterCreation - numberOfGiftCards).toEqual(1);
});
test("TC: SALEOR_107 Resend code @e2e @gift", async () => {
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.waitForGrid();
  await giftCardsPage.clickListRowBasedOnContainingText(
    GIFT_CARDS.giftCardToResendCode.name,
  );
  await giftCardsPage.clickResendCodeButton();
  await giftCardsPage.resendGiftCardCodeDialog.clickResendButton();

  await giftCardsPage.expectSuccessBanner();
});
test("TC: SALEOR_108 Deactivate gift card @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(
    GIFT_CARDS.giftCardToBeDeactivated.id,
  );
  await giftCardsPage.clickDeactivateButton();
  await giftCardsPage.expectSuccessBanner();
  await expect(giftCardsPage.pageHeader).toContainText("Disabled");
});
test("TC: SALEOR_109 Activate gift card @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(
    GIFT_CARDS.giftCardToBeActivated.id,
  );
  await giftCardsPage.clickDeactivateButton();
  await giftCardsPage.expectSuccessBanner();
  await expect(giftCardsPage.pageHeader).not.toContainText("Disabled");
});
test("TC: SALEOR_110 Edit gift card @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(
    GIFT_CARDS.giftCardToBeEdited.id,
  );
  await giftCardsPage.clickCardExpiresCheckbox();
  await giftCardsPage.metadataSeoPage.expandAndAddAllMetadata();
  await giftCardsPage.clickSaveButton();
  await giftCardsPage.expectSuccessBanner();
});
test("TC: SALEOR_111 Bulk delete gift cards @e2e @gift", async () => {
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.waitForGrid();
  const numberOfGiftCards = await giftCardsPage.getNumberOfGridRows();

  await giftCardsPage.checkListRowsBasedOnContainingText(
    GIFT_CARDS.giftCardsToBeDeleted.names,
  );
  await giftCardsPage.clickBulkDeleteButton();
  await giftCardsPage.deleteDialog.clickConfirmDeletionCheckbox();
  await giftCardsPage.deleteDialog.clickDeleteButton();
  await giftCardsPage.waitForGrid();

  expect(
    await giftCardsPage.findRowIndexBasedOnText(
      GIFT_CARDS.giftCardsToBeDeleted.names,
    ),
  ).toEqual([]);
});
test("TC: SALEOR_112 Set gift card balance @e2e @gift", async () => {
  await giftCardsPage.gotoExistingGiftCardView(GIFT_CARDS.giftCardToBeEdited.id);
  await giftCardsPage.clickSetBalance();
  await giftCardsPage.setGiftCardsBalanceDialog.setBalance("34")
  await giftCardsPage.expectSuccessBanner();
});
test("TC: SALEOR_113 Export gift card codes in XLSX file @e2e @gift", async () => {
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.clickShowMoreMenu();
  await giftCardsPage.clickExportGiftCards();
  await giftCardsPage.exportGiftCardsDialog.exportGiftCardCodes("XLSX");
  await mailpitService.checkDoesUserReceivedExportedData(
    process.env.E2E_USER_NAME!,
    "Your exported gift cards data is ready",
  );
});
test("TC: SALEOR_114 Export gift card codes in CSV file @e2e @gift", async () => {
  await giftCardsPage.gotoGiftCardsListView();
  await giftCardsPage.clickShowMoreMenu();
  await giftCardsPage.clickExportGiftCards();
  await giftCardsPage.exportGiftCardsDialog.exportGiftCardCodes("CSV");
  await mailpitService.checkDoesUserReceivedExportedData(
    process.env.E2E_USER_NAME!,
    "Your exported gift cards data is ready",
  );
});
