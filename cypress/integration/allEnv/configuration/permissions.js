import faker from "faker";

import {
  createPermissionGroup,
  getPermissionGroup
} from "../../../apiRequests/PermissionGroup.js";
import { getStaffMembersStartsWith } from "../../../apiRequests/StaffMembers";
import { USER_WITHOUT_NAME } from "../../../Data/users";
import { PERMISSION_GROUP_DETAILS } from "../../../elements/permissionGroup/permissionGroupDetails";
import { PERMISSION_GROUP_LIST } from "../../../elements/permissionGroup/permissionGroupsList";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import {
  permissionGroupDetails,
  staffMemberDetailsUrl,
  urlList
} from "../../../url/urlList";
import { deletePermissionGroupsStartsWith } from "../../../utils/permissionGroupUtils.js";

describe("Permissions groups", () => {
  const startsWith = "CyPermissions-";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deletePermissionGroupsStartsWith(startsWith);
  });

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

  it("should delete permission group", () => {
    const permissionName = `${startsWith}${faker.datatype.number()}`;
    let staffMember;
    getStaffMembersStartsWith(USER_WITHOUT_NAME.email)
      .its("body.data.staffUsers.edges")
      .then(staffMemberResp => {
        staffMember = staffMemberResp[0].node;
        createPermissionGroup({
          name: permissionName,
          userIdsArray: `["${staffMember.id}"]`,
          permissionsArray: "[MANAGE_PRODUCTS]"
        });
        cy.visit(urlList.permissionsGroups);
        cy.contains(PERMISSION_GROUP_LIST.permissionGroupRow, permissionName)
          .should("be.visible")
          .find(BUTTON_SELECTORS.deleteIcon)
          .click()
          .get(BUTTON_SELECTORS.submit)
          .click();
        cy.contains(PERMISSION_GROUP_LIST.permissionGroupRow, permissionName)
          .should("not.exist")
          .visit(staffMemberDetailsUrl(staffMember.id));
        cy.get(SHARED_ELEMENTS.header).should("be.visible");
        cy.contains(permissionName).should("not.exist");
      });
  });

  it("should add user to permission group", () => {
    const permissionName = `${startsWith}${faker.datatype.number()}`;
    createPermissionGroup({
      name: permissionName,
      permissionsArray: "[MANAGE_PRODUCTS]"
    })
      .then(({ group }) => {
        cy.visit(permissionGroupDetails(group.id))
          .get(PERMISSION_GROUP_DETAILS.assignMemberButton)
          .click()
          .get(PERMISSION_GROUP_DETAILS.searchField)
          .type(USER_WITHOUT_NAME.email)
          .get(PERMISSION_GROUP_DETAILS.userRow)
          .should("have.length", 1)
          .find(BUTTON_SELECTORS.checkbox)
          .click()
          .get(BUTTON_SELECTORS.submit)
          .click()
          .addAliasToGraphRequest("PermissionGroupUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@PermissionGroupUpdate");
        getPermissionGroup(group.id);
      })
      .then(resp => {
        expect(resp.users).to.have.length(1);
        expect(resp.users[0].email).to.be.eq(USER_WITHOUT_NAME.email);
      });
  });

  it("should remove user from permission group", () => {
    const permissionName = `${startsWith}${faker.datatype.number()}`;
    let staffMember;
    getStaffMembersStartsWith(USER_WITHOUT_NAME.email)
      .its("body.data.staffUsers.edges")
      .then(staffMemberResp => {
        staffMember = staffMemberResp[0].node;
        createPermissionGroup({
          name: permissionName,
          userIdsArray: `["${staffMember.id}"]`,
          permissionsArray: "[MANAGE_PRODUCTS]"
        });
      })
      .then(({ group }) => {
        cy.visit(permissionGroupDetails(group.id))
          .get(PERMISSION_GROUP_DETAILS.removeUserButton)
          .click()
          .get(BUTTON_SELECTORS.submit)
          .click()
          .addAliasToGraphRequest("PermissionGroupUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@PermissionGroupUpdate");
        cy.visit(staffMemberDetailsUrl(staffMember.id));
        cy.get(SHARED_ELEMENTS.header).should("be.visible");
        cy.contains(permissionName).should("not.exist");
      });
  });
});
