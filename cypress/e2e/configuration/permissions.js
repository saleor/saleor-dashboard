/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PERMISSION_GROUP_DETAILS_SELECTORS } from "../../elements/permissionGroup/permissionGroupDetails";
import { PERMISSION_GROUP_LIST_SELECTORS } from "../../elements/permissionGroup/permissionGroupsList";
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
import { ensureCanvasStatic } from "../../support/customCommands/sharedElementsOperations/canvas";

describe("Permissions groups", () => {
  const startsWith = "CyPermissions-" + Date.now();
  const permissionManageProducts = "[MANAGE_PRODUCTS]";

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should create permission group. TC: SALEOR_1401",
    { tags: ["@permissions", "@allEnv", "@stable"] },
    () => {
      const permissionName = `${startsWith}${faker.datatype.number()}`;
      cy.addAliasToGraphRequest("PermissionGroupCreate");
      cy.visit(urlList.permissionsGroups)
        .get(PERMISSION_GROUP_LIST_SELECTORS.createPermissionButton)
        .click()
        .get(PERMISSION_GROUP_DETAILS_SELECTORS.nameInput)
        .type(permissionName)
        .get(PERMISSION_GROUP_DETAILS_SELECTORS.productsPermissionCheckbox)
        .check()
        .get(
          PERMISSION_GROUP_DETAILS_SELECTORS.productsTypesAndAttributesPermissionCheckbox,
        )
        .check()
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .wait("@PermissionGroupCreate")
        .then(createPermissionRequest => {
          const permissionGroupResponse =
            createPermissionRequest.response.body.data.permissionGroupCreate;
          expect(permissionGroupResponse.errors).to.have.length(0);
          expect(permissionGroupResponse.group.name).to.contain(permissionName);
          expect(permissionGroupResponse.group.permissions).to.have.length(2);
        });
    },
  );

  it(
    "should delete permission group. TC: SALEOR_1402",
    { tags: ["@permissions", "@allEnv", "@stable"] },
    () => {
      const permissionName = `A-${startsWith}${faker.datatype.number()}`;
      let staffMember;
      cy.addAliasToGraphRequest("PermissionGroupDelete");
      getStaffMembersStartsWith(TEST_ADMIN_USER.email)
        .its("body.data.staffUsers.edges")
        .then(staffMemberResp => {
          staffMember = staffMemberResp[0].node;
          createPermissionGroup({
            name: permissionName,
            userIdsArray: `["${staffMember.id}"]`,
            permissionsArray: permissionManageProducts,
          }).then(createPermissionGroupResponse => {
            cy.visit(
              urlList.permissionsGroups +
                createPermissionGroupResponse.group.id,
            );
            cy.contains(SHARED_ELEMENTS.header, permissionName);
            cy.get(BUTTON_SELECTORS.deleteButton).click();
            cy.clickSubmitButton().waitForRequestAndCheckIfNoErrors(
              "@PermissionGroupDelete",
            );
            ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
            cy.get(SHARED_ELEMENTS.dataGridTable).should(
              "not.contain.text",
              permissionName,
            );
          });
        });
    },
  );

  it(
    "should add user to permission group. TC: SALEOR_1403",
    { tags: ["@permissions", "@allEnv", "@stable"] },
    () => {
      const permissionName = `${startsWith}${faker.datatype.number()}`;

      createPermissionGroup({
        name: permissionName,
        permissionsArray: permissionManageProducts,
      }).then(({ group }) => {
        cy.visit(permissionGroupDetails(group.id))
          .get(PERMISSION_GROUP_DETAILS_SELECTORS.assignMemberButton)
          .click()
          .get(PERMISSION_GROUP_DETAILS_SELECTORS.searchField)
          .type(TEST_ADMIN_USER.email);
        cy.contains(
          PERMISSION_GROUP_DETAILS_SELECTORS.userRow,
          `${TEST_ADMIN_USER.name} ${TEST_ADMIN_USER.lastName}`,
        )
          .should("have.length", 1)
          .find(BUTTON_SELECTORS.checkbox)
          .check()
          .get(BUTTON_SELECTORS.submit)
          .click()
          .addAliasToGraphRequest("PermissionGroupUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .waitForRequestAndCheckIfNoErrors("@PermissionGroupUpdate");
        getPermissionGroup(group.id)
          .its("users")
          .should("have.length", 1)
          .its("0.email")
          .should("eq", TEST_ADMIN_USER.email);
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
            permissionsArray: permissionManageProducts,
          });
        })
        .then(({ group }) => {
          cy.visit(permissionGroupDetails(group.id))
            .get(PERMISSION_GROUP_DETAILS_SELECTORS.removeUserButton)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .addAliasToGraphRequest("PermissionGroupUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@PermissionGroupUpdate");
          cy.visit(staffMemberDetailsUrl(staffMember.id))
            .get(SHARED_ELEMENTS.header)
            .should("be.visible")
            .contains(permissionName)
            .should("not.exist");
        });
    },
  );
});
