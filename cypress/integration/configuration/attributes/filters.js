import { updateAttribute } from "../../../apiRequests/Attribute";
import { createProduct } from "../../../apiRequests/Product";
import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";
import { enterAttributeAndChanegeIsFilterableInDashbord } from "../../../steps/attributesSteps";
import {
  enterProductListPage,
  selectAttributeFilter,
  showFilters
} from "../../../steps/catalog/products/productsListSteps";
import {
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";

describe("Tests for using attributes in filters", () => {
  const startsWith = "AttrFilter";

  let attribute;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    createTypeAttributeAndCategoryForProduct(startsWith, [startsWith]).then(
      ({ attribute: attributeResp, category, productType }) => {
        attribute = attributeResp;
        createProduct({
          attributeId: attribute.id,
          attributeValue: startsWith,
          categoryId: category.id,
          productTypeId: productType.id,
          name: startsWith
        });
      }
    );
  });

  it("should use attribute as filter", () => {
    updateAttribute({ filterableInDashboard: false });
    enterAttributeAndChanegeIsFilterableInDashbord(attribute.id);
    enterProductListPage();
    selectAttributeFilter(attribute.slug, startsWith);
    cy.contains(SHARED_ELEMENTS.tableRow, startsWith).should("be.visible");
  });

  it("should remove attribute from filters", () => {
    updateAttribute({ filterableInDashboard: false });
    enterAttributeAndChanegeIsFilterableInDashbord(attribute.id);
    enterProductListPage();
    showFilters();
    cy.contains(attribute.name).should("not.exist");
  });
});
