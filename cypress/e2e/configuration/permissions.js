/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PERMISSION_GROUP_DETAILS } from "../../elements/permissionGroup/permissionGroupDetails";
import { PERMISSION_GROUP_LIST } from "../../elements/permissionGroup/permissionGroupsList";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import {
  permissionGroupDetails,
  staffMemberDetailsUrl,
  urlList,
} from "../../fixtures/urlList";
import { TEST_ADMIN_USER } from "../../fixtures/users.js";
import {
  createPermissionGroup,
  getPermissionGroup,
} from "../../support/api/requests/PermissionGroup.js";
import { getStaffMembersStartsWith } from "../../support/api/requests/StaffMembers";
import { deletePermissionGroupsStartsWith } from "../../support/api/utils/permissionGroupUtils.js";
import filterTests from "../../support/filterTests.js";

describe("Permissions groups", () => {
  const startsWith = "CyPermissions-";

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deletePermissionGroupsStartsWith(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should create permission group. TC: SALEOR_1401",
    { tags: ["@permissions", "@allEnv", "@stable"] },
    () => {
      const permissionName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(urlList.permissionsGroups)
        .get(PERMISSION_GROUP_LIST.createPermissionButton)
        .click()
        .get(PERMISSION_GROUP_DETAILS.nameInput)
        .type(permissionName)
        .get(PERMISSION_GROUP_DETAILS.productsPermissionCheckbox)
        .click()
        .get(
          PERMISSION_GROUP_DETAILS.productsTypesAndAttributesPermissionCheckbox,
        )
        .click()
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .get(PERMISSION_GROUP_DETAILS.assignMemberButton)
        .should("be.visible")
        .get(BUTTON_SELECTORS.back)
        .click()
        .waitForProgressBarToNotExist();
      cy.contains(
        PERMISSION_GROUP_LIST.permissionGroupRow,
        permissionName,
      ).should("be.visible");
    },
  );

  it(
    "should delete permission group. TC: SALEOR_1402",
    { tags: ["@permissions", "@allEnv"] },
    () => {
      const permissionName = `${startsWith}${faker.datatype.number()}`;
      let staffMember;
      getStaffMembersStartsWith(TEST_ADMIN_USER.email)
        .its("body.data.staffUsers.edges")
        .then(staffMemberResp => {
          staffMember = staffMemberResp[0].node;
          createPermissionGroup({
            name: permissionName,
            userIdsArray: `["${staffMember.id}"]`,
            permissionsArray: "[MANAGE_PRODUCTS]",
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
    },
  );

  xit(
    "should add user to permission group. TC: SALEOR_1403",
    { tags: ["@permissions", "@allEnv"] },
    () => {
      const permissionName = `${startsWith}${faker.datatype.number()}`;
      createPermissionGroup({
        name: permissionName,
        permissionsArray: "[MANAGE_PRODUCTS]",
      })
        .then(({ group }) => {
          cy.visit(permissionGroupDetails(group.id))
            .get(PERMISSION_GROUP_DETAILS.assignMemberButton)
            .click()
            .get(PERMISSION_GROUP_DETAILS.searchField)
            .type(TEST_ADMIN_USER.email);
          cy.contains(
            PERMISSION_GROUP_DETAILS.userRow,
            `${TEST_ADMIN_USER.name} ${TEST_ADMIN_USER.lastName}`,
          )
            .should("have.length", 1)
            .find(BUTTON_SELECTORS.checkbox)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .addAliasToGraphRequest("PermissionGroupUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@PermissionGroupUpdate");
          getPermissionGroup(group.id);
        })
        .then(resp => {
          expect(resp.users).to.have.length(1);
          expect(resp.users[0].email).to.be.eq(TEST_ADMIN_USER.email);
        });
    },
  );

  it(
    "should remove user from permission group. TC: SALEOR_1404",
    { tags: ["@permissions", "@allEnv", "@stable"] },
    () => {
      const permissionName = `${startsWith}${faker.datatype.number()}`;
      let staffMember;
      getStaffMembersStartsWith(TEST_ADMIN_USER.email)
        .its("body.data.staffUsers.edges")
        .then(staffMemberResp => {
          staffMember = staffMemberResp[0].node;
          createPermissionGroup({
            name: permissionName,
            userIdsArray: `["${staffMember.id}"]`,
            permissionsArray: "[MANAGE_PRODUCTS]",
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
            .waitForRequestAndCheckIfNoErrors("@PermissionGroupUpdate");
          cy.visit(staffMemberDetailsUrl(staffMember.id));
          cy.get(SHARED_ELEMENTS.header).should("be.visible");
          cy.contains(permissionName).should("not.exist");
        });
    },
  );
});
