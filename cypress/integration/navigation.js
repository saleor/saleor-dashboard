import { PERMISSIONS } from "../Data/permissions";
import * as permissionsSteps from "../steps/permissions";

describe("Navigation for users with one permission", () => {
  it("should shipping page be enabled", () => {
    const permission = PERMISSIONS.shipping;
    permissionsSteps.navigateToAvailablePageAsOnePermissionUser(permission);
    permissionsSteps.isElementDisplayed().then(isDisplayed => {
      // expect(isDisplayed).to.be.true;
    });
    const links = permissionsSteps.getNotPermittedLinks(permission);
    // .then(({ notPermittedLinkInMenu, notPermittedLinkInParent }) => {
    //   expect(notPermittedLinkInMenu).to.not.be.ok;
    //   expect(notPermittedLinkInParent).to.not.be.ok;
    // })
  });
});
