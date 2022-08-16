/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import {
  getElementByDataTestId,
  SHARED_ELEMENTS,
} from "../../../elements/shared/sharedElements";
import { updateAttribute } from "../../../support/api/requests/Attribute";
import { createProduct } from "../../../support/api/requests/Product";
import {
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../../support/api/utils/products/productsUtils";
import { enterAttributeAndChanegeIsFilterableInDashbord } from "../../../support/pages/attributesPage";
import {
  enterProductListPage,
  selectAttributeFilter,
  showFilters,
} from "../../../support/pages/catalog/products/productsListPage";

xdescribe("Tests for using attributes in filters", () => {
  const startsWith = "AttrFilter";

  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    createTypeAttributeAndCategoryForProduct({
      name: startsWith,
      attributeValues: [startsWith],
    }).then(({ attribute: attributeResp, category, productType }) => {
      attribute = attributeResp;
      createProduct({
        attributeId: attribute.id,
        attributeValue: startsWith,
        categoryId: category.id,
        productTypeId: productType.id,
        name: startsWith,
      });
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should use attribute as filter",
    { tags: ["@attribute", "@allEnv"] },
    () => {
      updateAttribute({
        attributeId: attribute.id,
        filterableInDashboard: false,
      });
      enterAttributeAndChanegeIsFilterableInDashbord(attribute.id);
      enterProductListPage();
      selectAttributeFilter(attribute.slug, attribute.name);
      cy.contains(SHARED_ELEMENTS.tableRow, attribute.name).should(
        "be.visible",
      );
    },
  );

  it(
    "should remove attribute from filters",
    { tags: ["@attribute", "@allEnv"] },
    () => {
      updateAttribute({
        attributeId: attribute.id,
        filterableInDashboard: true,
      });
      enterAttributeAndChanegeIsFilterableInDashbord(attribute.id);
      enterProductListPage();
      showFilters();
      cy.get(getElementByDataTestId(attribute.name)).should("not.exist");
    },
  );
});
