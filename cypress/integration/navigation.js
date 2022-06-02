/// <reference types="cypress"/>
/// <reference types="../support"/>

import {
  APP_MENU_SELECTORS,
  LEFT_MENU_SELECTORS
} from "../elements/account/left-menu/left-menu-selectors";
import { PERMISSIONS } from "../fixtures/permissions";
import { PERMISSIONS_OPTIONS } from "../fixtures/permissionsUsers";
import { urlList } from "../fixtures/urlList";
import filterTests from "../support/filterTests";
import * as permissionsSteps from "../support/pages/permissionsPage";

describe("As a staff user I want to navigate through shop using different permissions", () => {
  const permissionsOptions = PERMISSIONS_OPTIONS;

  before(() => {
    cy.loginUserViaRequest()
      .visit("/")
      .get("body")
      .then(body => {
        // This will be deleted when Marketplace is released
        // Consider this solution as temporary
        if (body.find(LEFT_MENU_SELECTORS.appSection)) {
          const appPermissions = {
            parent: {
              parentMenuSelector: LEFT_MENU_SELECTORS.appSection,
              parentSelectors: [APP_MENU_SELECTORS]
            },
            permissionSelectors: [APP_MENU_SELECTORS.app]
          };
          permissionsOptions.all.permissions.push(appPermissions);
          permissionsOptions.app.permissions = [appPermissions];
        } else {
          const appPermissions = {
            permissionSelectors: [menuSelectors.LEFT_MENU_SELECTORS.app]
          };
          permissionsOptions.all.permissions.push(appPermissions);
          permissionsOptions.app.permissions = [appPermissions];
        }
      });
  });

  Object.keys(permissionsOptions).forEach(key => {
    const tags =
      key === "all" ? ["critical", "all", "refactored"] : ["all", "refactored"];
    filterTests({ definedTags: tags }, () => {
      it(`should be able to navigate through shop as a staff member using ${key} permission. ${permissionsOptions[key].testCase}`, () => {
        const permissionOption = permissionsOptions[key];
        const permissions = permissionOption.permissions;
        cy.clearSessionData();
        permissionsSteps.navigateToAllAvailablePageAndCheckIfDisplayed(
          permissionOption
        );
        if (key === "all") {
          return;
        }
        permissionsSteps
          .getDisplayedSelectors()
          .then(selectors => {
            permissionsSteps.expectAllSelectorsPermitted(
              permissions,
              selectors
            );
          })
          .then(() => {
            if (!permissions) {
              return;
            }
            permissions.forEach(permission => {
              if (permission.parent) {
                cy.get(permission.parent.parentMenuSelector)
                  .click()
                  .then(() => {
                    permissionsSteps.getDisplayedSelectors(
                      permission.parent.parentSelectors
                    );
                  })
                  .then(parentSelectors => {
                    permissionsSteps.expectAllSelectorsPermitted(
                      permissions,
                      parentSelectors
                    );
                  });
              }
            });
          });
      });
    });
  });
});
