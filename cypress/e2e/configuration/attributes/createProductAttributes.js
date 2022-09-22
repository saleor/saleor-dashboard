/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { ATTRIBUTES_DETAILS } from "../../../elements/attribute/attributes_details";
import { ATTRIBUTES_LIST } from "../../../elements/attribute/attributes_list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { attributeDetailsUrl, urlList } from "../../../fixtures/urlList";
import {
  createAttribute,
  getAttribute,
} from "../../../support/api/requests/Attribute";
import { deleteAttributesStartsWith } from "../../../support/api/utils/attributes/attributeUtils";
import { expectCorrectDataInAttribute } from "../../../support/api/utils/attributes/checkAttributeData";
import {
  createAttributeWithInputType,
  fillUpAttributeNameAndCode,
} from "../../../support/pages/attributesPage";

describe("As an admin I want to create product attribute", () => {
  const startsWith = "AttrCreate";
  const attributesTypes = [
    { type: "DROPDOWN", testCase: "SALEOR_0501" },
    { type: "MULTISELECT", testCase: "SALEOR_0502" },
    { type: "FILE", testCase: "SALEOR_0503" },
    { type: "RICH_TEXT", testCase: "SALEOR_0504" },
    { type: "BOOLEAN", testCase: "SALEOR_0505" },
    { type: "DATE", testCase: "SALEOR_0523" },
    { type: "DATE_TIME", testCase: "SALEOR_0524" },
  ];
  const attributeReferenceType = [
    { type: "PRODUCT", testCase: "SALEOR_0506" },
    { type: "PAGE", testCase: "SALEOR_0507" },
    { type: "PRODUCT_VARIANT", testCase: "SALEOR_0539" },
  ];
  const attributeNumericType = [
    {
      unitSystem: "IMPERIAL",
      unitsOf: "DISTANCE",
      unit: "FT",
      testCase: "SALEOR_0508",
    },
    {
      unitSystem: "METRIC",
      unitsOf: "VOLUME",
      unit: "CUBIC_CENTIMETER",
      testCase: "SALEOR_0509",
    },
    { unitSystem: "without selecting unit", testCase: "SALEOR_0510" },
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
    it(
      `should be able to create ${attributeType.type} attribute. TC:${attributeType.testCase}`,
      { tags: ["@attribute", "@allEnv", "@stable"] },
      () => {
        const attributeName = `${startsWith}${faker.datatype.number()}`;

        createAttributeWithInputType({
          name: attributeName,
          attributeType: attributeType.type,
        })
          .then(({ attribute }) => {
            getAttribute(attribute.id);
          })
          .then(attribute => {
            expectCorrectDataInAttribute(attribute, {
              attributeName,
              attributeType: attributeType.type,
            });
          });
      },
    );
  });

  attributeReferenceType.forEach(entityType => {
    it(
      `should be able to create ${entityType.type} attribute. TC:${entityType.testCase}`,
      { tags: ["@attribute", "@allEnv", "@stable"] },
      () => {
        const attributeType = "REFERENCE";
        const attributeName = `${startsWith}${faker.datatype.number()}`;

        createAttributeWithInputType({
          name: attributeName,
          attributeType,
          entityType: entityType.type,
        })
          .then(({ attribute }) => {
            getAttribute(attribute.id);
          })
          .then(attribute => {
            expectCorrectDataInAttribute(attribute, {
              attributeName,
              attributeType,
              entityType: entityType.type,
            });
          });
      },
    );
  });

  attributeNumericType.forEach(numericSystemType => {
    it(
      `should be able to create numeric ${numericSystemType.unitSystem} attribute. TC:${numericSystemType.testCase}`,
      { tags: ["@attribute", "@allEnv", "@stable"] },
      () => {
        const attributeType = "NUMERIC";
        const attributeName = `${startsWith}${faker.datatype.number()}`;

        createAttributeWithInputType({
          name: attributeName,
          attributeType,
          numericSystemType,
        })
          .then(({ attribute }) => {
            getAttribute(attribute.id);
          })
          .then(attribute => {
            expectCorrectDataInAttribute(attribute, {
              attributeName,
              attributeType,
              unit: numericSystemType.unit,
            });
          });
      },
    );
  });

  it(
    "should be able to create attribute without require value. TC:SALEOR_0511",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      const attributeType = "BOOLEAN";
      const attributeName = `${startsWith}${faker.datatype.number()}`;

      createAttributeWithInputType({
        name: attributeName,
        attributeType,
        valueRequired: false,
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            valueRequired: false,
          });
        });
    },
  );

  it(
    "should create swatch attribute. TC:SALEOR_0531",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      const attributeType = "SWATCH";
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      createAttributeWithInputType({
        name: attributeName,
        attributeType,
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            valueRequired: true,
          });
        });
    },
  );

  it(
    "should create swatch attribute with image. TC:SALEOR_0532",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      const attributeType = "SWATCH";
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      const swatchImage = "images/saleorDemoProductSneakers.png";
      createAttributeWithInputType({
        name: attributeName,
        attributeType,
        swatchImage,
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            valueRequired: true,
          });
          cy.get(ATTRIBUTES_DETAILS.swatchValueImage)
            .invoke("attr", "style")
            .should("include", "saleorDemoProductSneakers");
        });
    },
  );

  it(
    "should be able delete product attribute. TC:SALEOR_0525",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      const attributeName = `${startsWith}${faker.datatype.number()}`;

      createAttribute({
        name: attributeName,
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
    },
  );

  it(
    "should be able update product attribute. TC:SALEOR_0526",
    { tags: ["@attribute", "@allEnv", "@stable"] },
    () => {
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      const attributeUpdatedName = `${startsWith}${faker.datatype.number()}`;

      createAttribute({
        name: attributeName,
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
    },
  );
});
