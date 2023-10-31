/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS, PAGE_DETAILS_SELECTORS } from "../../elements";
import { pageDetailsUrl, urlList } from "../../fixtures/urlList";
import {
  attributeRequests,
  pageRequests,
  pageTypeRequests,
} from "../../support/api/requests";
import { pageDetailsPage, pagesPage } from "../../support/pages";

describe("Tests for pages", () => {
  const startsWith = `Pages`;
  const name = `${startsWith}${faker.datatype.number()}`;
  let attribute;
  let pageType;
  let pageTypeId;

  const attributes = [
    { key: "DROPDOWN", value: "value", TC: "SALEOR_2203" },
    { key: "MULTISELECT", value: "value", TC: "SALEOR_2204" },
    { key: "RICH_TEXT", value: faker.lorem.sentence(), TC: "SALEOR_2205" },
    { key: "BOOLEAN", value: true, TC: "SALEOR_2206" },
    { key: "NUMERIC", value: 1, TC: "SALEOR_2207" },
  ];

  before(() => {
    cy.loginUserViaRequest();
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
    cy.loginUserViaRequest();
  });

  it(
    "should create not published page. TC: SALEOR_2201",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("PageType");
      const pageName = `${startsWith}${faker.datatype.number()}`;
      cy.visit(urlList.pages);
      pagesPage.openCreatePageDialog();
      pagesPage.selectPageTypeOnIndex(0);
      cy.get(BUTTON_SELECTORS.confirmButton).click();
      cy.waitForRequestAndCheckIfNoErrors("@PageType");
      pageDetailsPage.typePageName(pageName).should("have.value", pageName);
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
    "should create published page. TC: SALEOR_2202",
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

  attributes.forEach(attributeType => {
    it(
      `should create page with ${attributeType.key} attribute TC: ${attributeType.TC}`,
      { tags: ["@attribute", "@pages", "@allEnv"] },
      () => {
        const randomName = `${startsWith}${faker.datatype.number()}`;
        const attributeKey = attributeType.key;
        const attributeValue = attributeType.value;
        attributeRequests
          .createAttribute({
            name: randomName,
            type: "PAGE_TYPE",
            inputType: attributeKey,
            attributeValues: [attributeValue],
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
                    attributeType: attributeKey,
                    attributeValue: attributeValue,
                  })
                  .then(page => {
                    pageRequests.getPage(page.id);
                  })
                  .then(page => {
                    expect(page.attributes[0].values[0].inputType).to.eq(
                      attributeKey,
                    );
                    if (attributeKey === "BOOLEAN") {
                      expect(page.attributes[0].values[0].name).to.includes(
                        "Yes".toString(),
                      );
                    } else {
                      expect(page.attributes[0].values[0].name).to.eq(
                        attributeValue.toString(),
                      );
                    }
                  });
              });
          });
      },
    );
  });

  it(
    "should delete page TC: SALEOR_2209",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
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
    },
  );

  it(
    "should update page TC: SALEOR_2208",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
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
    },
  );
});
