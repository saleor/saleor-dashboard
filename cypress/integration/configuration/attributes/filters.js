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
    updateAttribute({
      attributeId: attribute.id,
      filterableInDashboard: false
    });
    enterAttributeAndChanegeIsFilterableInDashbord(attribute.id);
    enterProductListPage();
    selectAttributeFilter(attribute.slug, attribute.name);
    cy.contains(SHARED_ELEMENTS.tableRow, attribute.name).should("be.visible");
  });

  it("should remove attribute from filters", () => {
    updateAttribute({ attributeId: attribute.id, filterableInDashboard: true });
    enterAttributeAndChanegeIsFilterableInDashbord(attribute.id);
    enterProductListPage();
    showFilters();
    cy.contains(SHARED_ELEMENTS.filters.filterRow, attribute.name).should(
      "not.exist"
    );
  });
});
