import { BasicApiService } from "@api/basics";
import { USERS } from "@data/e2eTestData";
import { URL_LIST } from "@data/url";
import { StaffMembersPage } from "@pages/staffMembersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/admin.json" });

test("TC: SALEOR_37 Admin User should be able to deactivate other user @e2e @staff-members", async ({
  page,
  request,
}) => {
  const staffMembersPage = new StaffMembersPage(page, request);
  const basicApiService = new BasicApiService(request);

  await page.goto(URL_LIST.staffMembers + USERS.userToBeDeactivated.id);
  await staffMembersPage.clickIsActiveCheckbox();
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(
    false,
  );

  const loginViaApiDeactivatedUserResponse =
    await basicApiService.logInUserViaApi({
      email: USERS.userToBeDeactivated.email,
      password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    });
  await expect(
    loginViaApiDeactivatedUserResponse.data.tokenCreate.errors[0].code,
  ).toEqual("INACTIVE");
});

test("TC: SALEOR_38 Admin User should be able to activate other user @e2e @staff-members", async ({
  page,
  request,
}) => {
  const staffMembersPage = new StaffMembersPage(page, request);
  const basicApiService = new BasicApiService(request);

  await page.goto(URL_LIST.staffMembers + USERS.userToBeActivated.id);
  await staffMembersPage.clickIsActiveCheckbox();
  await staffMembersPage.clickSaveButton();
  await staffMembersPage.basePage.expectSuccessBanner();
  await expect(await staffMembersPage.isActiveCheckbox.isChecked()).toEqual(
    true,
  );

  const loginViaApiDeactivatedUserResponse =
    await basicApiService.logInUserViaApi({
      email: USERS.userToBeActivated.email,
      password: process.env.E2E_PERMISSIONS_USERS_PASSWORD!,
    });
  await expect(
    loginViaApiDeactivatedUserResponse.data.tokenCreate.errors,
  ).toEqual([]);
  await expect(
    loginViaApiDeactivatedUserResponse.data.tokenCreate.token,
  ).not.toEqual(null);
});
