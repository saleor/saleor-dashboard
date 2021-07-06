import { PAGE_TYPE_DETAILS } from "../../../elements/pageTypes/pageTypeDetails";
import { PAGE_TYPES_LIST } from "../../../elements/pageTypes/pageTypesList";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../url/urlList";

describe("Tests for page types", () => {
  const startsWith = "PageTypes";

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create page type", () => {
    const randomName = startsWith + faker.datatype.number();

    cy.visit(urlList.pageTypes)
      .get(PAGE_TYPES_LIST.createPageTypeButton)
      .click()
      .get(PAGE_TYPE_DETAILS.nameInput)
      .type(randomName)
      .get(BUTTON_SELECTORS.confirm)
      .click();
  });
});
