/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  BUTTON_SELECTORS,
  PAGE_DETAILS_SELECTORS,
} from "../../elements";
import {
  pageDetailsUrl,
  urlList,
} from "../../fixtures/urlList";
import {
  attributeRequests,
  pageRequests,
  pageTypeRequests,
} from "../../support/api/requests";
import {
  pageDetailsPage,
  pagesPage,
} from "../../support/pages";

describe("Tests for pages", () => {
  const startsWith = `Pages`;
  const name = `${startsWith}${faker.datatype.number()}`;
  let attribute;
  let pageType;
  let pageTypeId;

  const attributeValuesOnPage = {
    NUMERIC: 1,
    RICH_TEXT: faker.lorem.sentence(),
    DROPDOWN: "value",
    MULTISELECT: "value",
    BOOLEAN: true,
  };

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    attributeRequests
      .createAttribute({ name, type: "PAGE_TYPE" })
      .then(attributeResp => {
        attribute = attributeResp;
        pageTypeRequests.createPageType({ name, attributeId: attribute.id });
      })
      .then(({ pageType: pageTypeResp }) => {
        pageType = pageTypeResp;
        cy.checkIfDataAreNotNull({ attribute, pageType });
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should create not published page",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("PageType");
      const pageName = `${startsWith}${faker.datatype.number()}`;
      cy.visit(urlList.pages);
      pagesPage.openCreatePageDialog();
      pagesPage.selectPageTypeOnIndex(0);
      cy.clickSubmitButton();
      cy.waitForRequestAndCheckIfNoErrors("@PageType");
      pageDetailsPage.typePageName(pageName);
      cy.get(PAGE_DETAILS_SELECTORS.isNotPublishedCheckbox).click();
      pagesPage.savePage().then(page => {
        pageRequests.getPage(page.id).then(page => {
          expect(page.title).to.eq(pageName);
          expect(page.isPublished).to.be.false;
          pageRequests.getPage(page.id, "token").should("be.null");
        });
      });
    },
  );

  it(
    "should create published page",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;

      pagesPage
        .createPage({
          pageName: randomName,
          pageTypeName: name,
          isPublished: true,
        })
        .then(page => {
          pageRequests.getPage(page.id, "token");
        })
        .then(page => {
          expect(page.title).to.eq(randomName);
          expect(page.isPublished).to.be.true;
          expect(page.attributes[0].attribute.id).to.eq(attribute.id);
        });
    },
  );

  Object.keys(pagesPage.attributesTypes).forEach(attributeType => {
    it(
      `should create page with ${attributeType} attribute`,
      { tags: ["@pages", "@allEnv", "@stable"] },
      () => {
        const randomName = `${startsWith}${faker.datatype.number()}`;
        const attributeValues = [attributeValuesOnPage[attributeType]];
        attributeRequests
          .createAttribute({
            name: randomName,
            type: "PAGE_TYPE",
            inputType: attributeType,
            attributeValues,
          })
          .then(attributeResp => {
            attribute = attributeResp;
            pageTypeRequests
              .createPageType({
                name: randomName,
                attributeId: attribute.id,
              })
              .then(createPageResponse => {
                pageTypeId = createPageResponse.pageType.id;
                cy.visit(`${urlList.addPageType}${pageTypeId}`);
                pagesPage
                  .createPageWithAttribute({
                    pageName: randomName,
                    pageTypeName: randomName,
                    attributeType,
                    attributeValue: attributeValuesOnPage[attributeType],
                  })
                  .then(page => {
                    pageRequests.getPage(page.id);
                  })
                  .then(page => {
                    expect(page.attributes[0].values[0].inputType).to.eq(
                      attributeType,
                    );
                    if (attributeType !== "BOOLEAN") {
                      expect(page.attributes[0].values[0].name).to.eq(
                        attributeValuesOnPage[attributeType].toString(),
                      );
                    } else {
                      expect(page.attributes[0].values[0].name).to.includes(
                        "Yes".toString(),
                      );
                    }
                  });
              });
          });
      },
    );
  });

  it("should delete page", { tags: ["@pages", "@allEnv", "@stable"] }, () => {
    const randomName = `${startsWith}${faker.datatype.number()}`;

    pageRequests
      .createPage({
        pageTypeId: pageType.id,
        title: randomName,
      })
      .then(({ page }) => {
        cy.visit(pageDetailsUrl(page.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("PageRemove")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@PageRemove");
        pageRequests.getPage(page.id).should("be.null");
      });
  });

  it("should update page", { tags: ["@pages", "@allEnv", "@stable"] }, () => {
    const randomName = `${startsWith}${faker.datatype.number()}`;
    const updatedName = `${startsWith}${faker.datatype.number()}`;

    pageRequests
      .createPage({
        pageTypeId: pageType.id,
        title: randomName,
        isPublished: true,
      })
      .then(({ page }) => {
        cy.visit(pageDetailsUrl(page.id))
          .get(PAGE_DETAILS_SELECTORS.nameInput)
          .clear()
          .type(updatedName)
          .get(PAGE_DETAILS_SELECTORS.isNotPublishedCheckbox)
          .click()
          .addAliasToGraphRequest("PageUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .waitForRequestAndCheckIfNoErrors("@PageUpdate");
        pageRequests.getPage(page.id);
      })
      .then(page => {
        expect(page.title).to.eq(updatedName);
        expect(page.isPublished).to.eq(false);
      });
  });
});
