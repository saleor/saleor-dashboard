import { PERMISSIONS_OPTIONS } from "../../Data/permissionsUsers";
import * as permissionsSteps from "../../steps/permissions";

describe("Navigation for users with different permissions", () => {
  Object.keys(PERMISSIONS_OPTIONS).forEach(key => {
    it(`should navigate as an user with ${key} permission`, () => {
      const permissionOption = PERMISSIONS_OPTIONS[key];
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
          permissionsSteps.expectAllSelectorsPermitted(permissions, selectors);
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
