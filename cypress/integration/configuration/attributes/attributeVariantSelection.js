/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import { urlList } from "../../../fixtures/urlList";
import { createAttribute } from "../../../support/api/requests/Attribute";
import { deleteAttributesStartsWith } from "../../../support/api/utils/attributes/attributeUtils";
import filterTests from "../../../support/filterTests";

filterTests({ definedTags: ["all"] }, () => {
  describe("Create attribute with type", () => {
    const startsWith = "VarSel";

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteAttributesStartsWith(startsWith);
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create variant with dropdown attribute", () => {
      const name = `${startsWith}Dropdown`;
      createAttribute({
        name,
        inputType: "DROPDOWN"
      });
      cy.visit(urlList.addProduct)
        .get(PRODUCT_)
        .pause();
    });
  });
});
