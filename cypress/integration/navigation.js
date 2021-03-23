import { PERMISSIONS_OPTIONS } from "../Data/permissionsUsers";
import * as permissionsSteps from "../steps/permissions";

describe("Navigation for users with one permission", () => {
  Object.keys(PERMISSIONS_OPTIONS).forEach(key => {
    it(`should ${key} be enabled`, () => {
      const permissionOption = PERMISSIONS_OPTIONS[key];
      const permissions = permissionOption.permissions;
      permissionsSteps.navigateToAllAvailablePageAndCheckIfDisplayed(
        permissionOption
      );
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
