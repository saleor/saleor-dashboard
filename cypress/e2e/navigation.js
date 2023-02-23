/// <reference types="cypress"/>
/// <reference types="../support"/>

import * as MENU_SELECTORS from "../elements/account/left-menu/left-menu-selectors";
import { PERMISSIONS_OPTIONS } from "../fixtures/permissionsUsers";
import { urlList } from "../fixtures/urlList";

// TODO: fix this test after release of new dashboard with sidebar
describe("As a staff user I want to navigate through shop using different permissions", () => {
  beforeEach(() => {
    cy.clearSessionData();
  });
  it.only(`should be able to navigate through shop as a staff member using DISCOUNTS permission. TC: SALEOR_3405 `, () => {
    cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.discount.user).visit(
      urlList.homePage,
    );
    cy.clickOnElement(MENU_SELECTORS.MENU.discounts).then(() => {
      cy.get(MENU_SELECTORS.DISCOUNTS.sales).should("be.visible");
      cy.get(MENU_SELECTORS.DISCOUNTS.vouchers).should("be.visible");
      // making sure permissions allow user see only granted elements
      cy.get(MENU_SELECTORS.MENU.list)
        .find(MENU_SELECTORS.MENU.listItem)
        .should("have.length", 1);
    });
  });

  // Object.keys(permissionsOptions).forEach(key => {
  //   if (key !== "all") {
  //     it(
  //       `should be able to navigate through shop as a staff member using ${key} permission. ${permissionsOptions[key].testCase}`,
  //       { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease"] },
  //       () => {
  //         const permissionOption = permissionsOptions[key];
  //         const permissions = permissionOption.permissions;

  //         cy.clearSessionData();
  // permissionsSteps.navigateToAllAvailablePageAndCheckIfDisplayed(
  //   permissionOption,
  // );
  //         permissionsSteps.getDisplayedSelectors().then(selectors => {
  //           permissionsSteps.expectAllSelectorsPermitted(
  //             permissions,
  //             selectors,
  //           );
  //         });
  //         if (!permissions) {
  //           return;
  //         }
  //         permissions.forEach(permission => {
  //           if (permission.parent) {
  //             // cy.get(permission.parent.parentMenuSelector).click();
  //             permissionsSteps
  //               .getDisplayedSelectors(permission.parent.parentSelectors)
  //               .then(parentSelectors => {
  //                 permissionsSteps.expectAllSelectorsPermitted(
  //                   permissions,
  //                   parentSelectors,
  //                 );
  //               });
  //           }
  //         });
  //       },
  //     );
  //   }
  // });

  // it(
  //   `should be able to navigate through shop as a staff member using all permissions. ${permissionsOptions.all.testCase}`,
  //   { tags: ["@critical", "@allEnv", "@navigation", "@stable", "@oldRelease"] },
  //   () => {
  //     const permissionOption = permissionsOptions.all;

  //     cy.clearSessionData();
  //     permissionsSteps.navigateToAllAvailablePageAndCheckIfDisplayed(
  //       permissionOption,
  //     );
  //   },
  // );
});
