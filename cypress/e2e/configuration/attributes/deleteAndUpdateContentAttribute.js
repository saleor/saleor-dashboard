// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { attributeDetailsUrl } from "../../../fixtures/urlList";
import {
  createAttribute,
  getAttribute,
} from "../../../support/api/requests/Attribute";
import { deleteAttributesStartsWith } from "../../../support/api/utils/attributes/attributeUtils";
import { fillUpAttributeNameAndCode } from "../../../support/pages/attributesPage";

describe("As an admin I want to delete and update content attribute", () => {
  const startsWith = "AttrContDel";
  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteAttributesStartsWith(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
    createAttribute({
      name: `${startsWith}${faker.datatype.number()}`,
      type: "PAGE_TYPE",
    }).then(attributeResp => {
      attribute = attributeResp;
    });
  });

  it(
    "should be able delete content attribute. TC:SALEOR_0529",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      cy.visit(attributeDetailsUrl(attribute.id))
        .get(BUTTON_SELECTORS.deleteButton)
        .click()
        .addAliasToGraphRequest("AttributeDelete")
        .get(BUTTON_SELECTORS.submit)
        .click()
        .waitForRequestAndCheckIfNoErrors("@AttributeDelete");
      getAttribute(attribute.id).should("be.null");
    },
  );

  it(
    "should be able update content attribute. TC:SALEOR_0530",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      const attributeUpdatedName = `${startsWith}${faker.datatype.number()}`;

      cy.visit(attributeDetailsUrl(attribute.id));
      fillUpAttributeNameAndCode(attributeUpdatedName);
      cy.addAliasToGraphRequest("AttributeUpdate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .waitForRequestAndCheckIfNoErrors("@AttributeUpdate");
      getAttribute(attribute.id).then(attributeResp => {
        expect(attributeResp.name).to.eq(attributeUpdatedName);
        expect(attributeResp.slug).to.eq(attributeUpdatedName);
      });
    },
  );
});
