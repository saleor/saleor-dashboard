import { SEARCH_SELECTORS } from "../../elements/frontend-elements/search-selectors";

class SearchSteps {
  searchFor(query) {
    cy.get(SEARCH_SELECTORS.searchButton)
      .click()
      .get(SEARCH_SELECTORS.searchInputField)
      .type(query);
  }
}
export default SearchSteps;
