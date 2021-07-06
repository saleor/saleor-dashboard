import faker from "faker";

import {
  createPermissionGroup,
  getPermissionGroup
} from "../../../apiRequests/PermissionGroup.js";
import { getStaffMembersStartsWith } from "../../../apiRequests/StaffMembers";
import { TEST_ADMIN_USER } from "../../../Data/users.js";
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
    getStaffMembersStartsWith(TEST_ADMIN_USER.email)
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
          .type(TEST_ADMIN_USER.email);
        cy.contains(
          PERMISSION_GROUP_DETAILS.userRow,
          `${TEST_ADMIN_USER.name} ${TEST_ADMIN_USER.lastName}`
        )
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
        expect(resp.users[0].email).to.be.eq(TEST_ADMIN_USER.email);
      });
  });

  it("should remove user from permission group", () => {
    const permissionName = `${startsWith}${faker.datatype.number()}`;
    let staffMember;
    getStaffMembersStartsWith(TEST_ADMIN_USER.email)
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
