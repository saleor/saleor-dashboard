/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { ATTRIBUTES_DETAILS } from "../../../elements/attribute/attributes_details";
import { ATTRIBUTES_LIST } from "../../../elements/attribute/attributes_list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { attributeDetailsUrl, urlList } from "../../../fixtures/urlList";
import {
  createAttribute,
  getAttribute
} from "../../../support/api/requests/Attribute";
import { deleteAttributesStartsWith } from "../../../support/api/utils/attributes/attributeUtils";
import { expectCorrectDataInAttribute } from "../../../support/api/utils/attributes/checkAttributeData";
import filterTests from "../../../support/filterTests";
import {
  createAttributeWithInputType,
  fillUpAttributeNameAndCode
} from "../../../support/pages/attributesPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Create attribute with type", () => {
    const startsWith = "AttrCreate";
    const attributesTypes = [
      "DROPDOWN",
      "MULTISELECT",
      "FILE",
      "RICH_TEXT",
      "BOOLEAN",
      "DATE",
      "DATE_TIME"
    ];
    const attributeReferenceType = ["PRODUCT", "PAGE"];
    const attributeNumericType = [
      { unitSystem: "IMPERIAL", unitsOf: "DISTANCE", unit: "FT" },
      { unitSystem: "METRIC", unitsOf: "VOLUME", unit: "CUBIC_CENTIMETER" },
      { unitSystem: "without selecting unit" }
    ];

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteAttributesStartsWith(startsWith);
    });

    beforeEach(() => {
      cy.clearSessionData()
        .loginUserViaRequest()
        .visit(urlList.attributes)
        .get(ATTRIBUTES_LIST.createAttributeButton)
        .click();
    });

    attributesTypes.forEach(attributeType => {
      it(`should create ${attributeType} attribute`, () => {
        const attributeName = `${startsWith}${faker.datatype.number()}`;

        createAttributeWithInputType({ name: attributeName, attributeType })
          .then(({ attribute }) => {
            getAttribute(attribute.id);
          })
          .then(attribute => {
            expectCorrectDataInAttribute(attribute, {
              attributeName,
              attributeType
            });
          });
      });
    });

    attributeReferenceType.forEach(entityType => {
      it(`should create reference ${entityType} attribute`, () => {
        const attributeType = "REFERENCE";
        const attributeName = `${startsWith}${faker.datatype.number()}`;

        createAttributeWithInputType({
          name: attributeName,
          attributeType,
          entityType
        })
          .then(({ attribute }) => {
            getAttribute(attribute.id);
          })
          .then(attribute => {
            expectCorrectDataInAttribute(attribute, {
              attributeName,
              attributeType,
              entityType
            });
          });
      });
    });

    attributeNumericType.forEach(numericSystemType => {
      it(`should create numeric attribute - ${numericSystemType.unitSystem}`, () => {
        const attributeType = "NUMERIC";
        const attributeName = `${startsWith}${faker.datatype.number()}`;

        createAttributeWithInputType({
          name: attributeName,
          attributeType,
          numericSystemType
        })
          .then(({ attribute }) => {
            getAttribute(attribute.id);
          })
          .then(attribute => {
            expectCorrectDataInAttribute(attribute, {
              attributeName,
              attributeType,
              unit: numericSystemType.unit
            });
          });
      });
    });

    it("should create attribute without required value", () => {
      const attributeType = "BOOLEAN";
      const attributeName = `${startsWith}${faker.datatype.number()}`;

      createAttributeWithInputType({
        name: attributeName,
        attributeType,
        valueRequired: false
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            valueRequired: false
          });
        });
    });

    it("should create swatch attribute", () => {
      const attributeType = "SWATCH";
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      createAttributeWithInputType({
        name: attributeName,
        attributeType
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            valueRequired: true
          });
        });
    });

    it("should create swatch attribute with image", () => {
      const attributeType = "SWATCH";
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      const swatchImage = "images/saleorDemoProductSneakers.png";
      createAttributeWithInputType({
        name: attributeName,
        attributeType,
        swatchImage
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            valueRequired: true
          });
          cy.get(ATTRIBUTES_DETAILS.swatchValueImage)
            .invoke("attr", "style")
            .should("include", "saleorDemoProductSneakers");
        });
    });

    it("should delete attribute", () => {
      const attributeName = `${startsWith}${faker.datatype.number()}`;

      createAttribute({
        name: attributeName
      }).then(attribute => {
        cy.visit(attributeDetailsUrl(attribute.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("AttributeDelete")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@AttributeDelete");
        getAttribute(attribute.id).should("be.null");
      });
    });

    it("should update attribute", () => {
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      const attributeUpdatedName = `${startsWith}${faker.datatype.number()}`;

      createAttribute({
        name: attributeName
      })
        .then(attribute => {
          cy.visit(attributeDetailsUrl(attribute.id));
          fillUpAttributeNameAndCode(attributeUpdatedName);
          cy.addAliasToGraphRequest("AttributeUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@AttributeUpdate");
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expect(attribute.name).to.eq(attributeUpdatedName);
          expect(attribute.slug).to.eq(attributeUpdatedName);
        });
    });
  });
});
