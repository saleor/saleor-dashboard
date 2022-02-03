import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";

export function enterCategoryTranslation(language, categoryName) {
  cy.addAliasToGraphRequest("CategoryTranslations");
  cy.get(language).click();
  getCategoryFromTable(categoryName);
}

function getCategoryFromTable(categoryName) {
  cy.wait("@CategoryTranslations")
    .its("response.body")
    .then(bodies => {
      const body = bodies[0];
      const edges = body.data.translations.edges;
      const isCategoryInResp = edges.find(
        edge => edge.node.category.name === categoryName
      );
      if (isCategoryInResp) {
        cy.contains(SHARED_ELEMENTS.tableRow, categoryName).click({
          force: true
        });
      } else {
        cy.get(BUTTON_SELECTORS.nextPaginationButton).click();
        getCategoryFromTable(categoryName);
      }
    });
}
