import faker from "faker";

import { PERMISSION_GROUP_DETAILS } from "../../../elements/permissionGroup/permissionGroupDetails";
import { PERMISSION_GROUP_LIST } from "../../../elements/permissionGroup/permissionGroupsList";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { urlList } from "../../../url/urlList";

describe("Permissions groups", () => {
  const startsWith = "CyPermissions-";

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create permission group", () => {
    const permissionName = `${startsWith}${faker.datatype.number()}`;

    cy.visit(urlList.permissionsGroups)
      .get(PERMISSION_GROUP_LIST.createPermissionButton)
      .click()
      .get(PERMISSION_GROUP_DETAILS.nameInput)
      .type(permissionName)
      .get(PERMISSION_GROUP_DETAILS.productsPermissionCheckbox)
      .click()
      .get(
        PERMISSION_GROUP_DETAILS.productsTypesAndAttributesPermissionCheckbox
      )
      .click()
      .get(BUTTON_SELECTORS.confirm)
      .click()
      .get(PERMISSION_GROUP_DETAILS.assignMemberButton)
      .should("be.visible")
      .get(BUTTON_SELECTORS.back)
      .click()
      .get(SHARED_ELEMENTS.progressBar)
      .should("not.exist");
    cy.contains(
      PERMISSION_GROUP_LIST.permissionGroupRow,
      permissionName
    ).should("be.visible");
  });

  // it("should delete permission group", () => {

  // });

  // it("should add user to permission group", () => {

  // });

  // it("should remove user from permission group", () => {

  // });
});
