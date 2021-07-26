import faker from "faker";

import { createAttribute } from "../../apiRequests/Attribute";
import { createPageType, getPageType } from "../../apiRequests/PageTypes";
import { PAGE_TYPE_DETAILS } from "../../elements/pageTypes/pageTypeDetails";
import { PAGE_TYPES_LIST } from "../../elements/pageTypes/pageTypesList";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { assignElements } from "../../steps/shared/assignElements";
import { confirmationMessageShouldDisappear } from "../../steps/shared/confirmationMessages";
import filterTests from "../../support/filterTests";
import { pageTypeDetailsUrl, urlList } from "../../url/urlList";

filterTests(["all"], () => {
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
        .addAliasToGraphRequest("PageTypeCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click();
      confirmationMessageShouldDisappear();
      cy.wait("@PageTypeCreate")
        .its("response.body.data.pageTypeCreate.pageType")
        .then(pageType => {
          getPageType(pageType.id);
        })
        .then(pageType => {
          expect(pageType.name).to.eq(randomName);
        });
    });

    it("should assign attribute", () => {
      const randomName = startsWith + faker.datatype.number();

      createAttribute({ name: randomName, type: "PAGE_TYPE" });
      createPageType(randomName)
        .then(({ pageType }) => {
          cy.visit(pageTypeDetailsUrl(pageType.id))
            .get(SHARED_ELEMENTS.progressBar)
            .should("be.not.visible")
            .get(PAGE_TYPE_DETAILS.assignAttributesButton)
            .click();
          assignElements(randomName, false);
          confirmationMessageShouldDisappear();
          getPageType(pageType.id);
        })
        .then(pageType => {
          expect(pageType.attributes[0].name).to.eq(randomName);
        });
    });
  });
});
