/// <reference types="cypress"/>
/// <reference types="../support"/>

import {
  ADDRESS_SELECTORS,
  APPS_LIST,
  CHANNELS_SELECTORS,
  CONFIGURATION_SELECTORS,
  CUSTOMERS_LIST,
  LANGUAGES_LIST,
  MENU_SELECTORS,
  ORDERS_SELECTORS,
  PAGE_TYPES_LIST,
  PAGES_LIST,
  PLUGINS_LIST,
  PRODUCT_TYPES_LIST,
  SALES_SELECTORS,
  SHIPPING_ZONES_LIST,
  STAFF_MEMBERS_LIST,
} from "../elements/";
import { PERMISSIONS_OPTIONS } from "../fixtures/permissionsUsers";
import { urlList } from "../fixtures/urlList";
import {
  expectConfigurationAvailableSectionsNumber,
  expectConfigurationSectionsToBeVisible,
} from "../support/pages/configurationPage";
import {
  expectMainMenuAvailableSections,
  expectMainMenuSectionsToBeVisible,
} from "../support/pages/mainMenuPage";

describe("As a staff user I want to navigate through shop using different permissions", () => {
  const tagsList = ["@allEnv", "@navigation", "@stable", "@oldRelease"];

  beforeEach(() => {
    cy.clearSessionData();
  });
  it(
    `should be able to navigate through shop as a staff member using DISCOUNTS permission. TC: SALEOR_3405 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.discount.user).visit(
        urlList.homePage,
      );
      cy.clickOnElement(MENU_SELECTORS.MENU.discounts).then(() => {
        expectMainMenuAvailableSections(4);
        expectMainMenuSectionsToBeVisible(
          MENU_SELECTORS.DISCOUNTS.sales,
          MENU_SELECTORS.DISCOUNTS.vouchers,
        );

        cy.addAliasToGraphRequest("SaleList")
          .get(MENU_SELECTORS.DISCOUNTS.sales)
          .click()
          .waitForRequestAndCheckIfNoErrors("@SaleList")
          .then(() => {
            expectMainMenuSectionsToBeVisible(SALES_SELECTORS.createSaleButton);
          });
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using ORDER permission. TC: SALEOR_3407 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.order.user).visit(
        urlList.homePage,
      );
      cy.clickOnElement(MENU_SELECTORS.MENU.orders).then(() => {
        expectMainMenuAvailableSections(4);
        expectMainMenuSectionsToBeVisible(
          MENU_SELECTORS.ORDERS.orders,
          MENU_SELECTORS.ORDERS.draftOrders,
        );

        cy.addAliasToGraphRequest("OrderList")
          .get(MENU_SELECTORS.ORDERS.orders)
          .last()
          .click()
          .waitForRequestAndCheckIfNoErrors("@OrderList")
          .then(() => {
            cy.get(ORDERS_SELECTORS.createOrderButton).should("be.visible");
          });
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using APP permission. TC: SALEOR_3402 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.app.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);

      cy.addAliasToGraphRequest("AppsList")
        .clickOnElement(MENU_SELECTORS.MENU.app)
        .waitForRequestAndCheckIfNoErrors("@AppsList")
        .then(() => {
          cy.get(APPS_LIST.createExternalAppButton).should("be.visible");
        });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using CHANNEL permission. TC: SALEOR_3403 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.channel.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);
      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(3);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.webhooks,
          CONFIGURATION_SELECTORS.channels,
        );
        cy.addAliasToGraphRequest("Channels")
          .get(CONFIGURATION_SELECTORS.channels)
          .click()
          .waitForRequestAndCheckIfNoErrors("@Channels");
        cy.get(CHANNELS_SELECTORS.createChannelButton).should("be.visible");
        // TODO check are channels are displayed
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using CUSTOMER permission. TC: SALEOR_3404 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.customer.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);
      cy.addAliasToGraphRequest("ListCustomers")
        .clickOnElement(MENU_SELECTORS.MENU.customers)
        .waitForRequestAndCheckIfNoErrors("@ListCustomers")
        .then(() => {
          cy.get(CUSTOMERS_LIST.createCustomerButton).should("be.visible");
          // TODO check is list displayed and api wait
        });
    },
  );

  // //TODO fix since lack of permissions
  it(
    `should be able to navigate through shop as a staff member using GIFT CARD permission. TC: SALEOR_3406 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.giftCard.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);
      cy.clickOnElement(MENU_SELECTORS.MENU.products).then(() => {
        cy.get(MENU_SELECTORS.CATALOG.giftCards).should("be.visible");
        expectMainMenuAvailableSections(3);
        cy.addAliasToGraphRequest("GiftCardList")
          .clickOnElement(MENU_SELECTORS.CATALOG.giftCards)
          .waitForRequestAndCheckIfNoErrors("@GiftCardList");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using PAGE permission. TC: SALEOR_3408 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.page.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(3);
      expectMainMenuSectionsToBeVisible(MENU_SELECTORS.MENU.pages);
      cy.addAliasToGraphRequest("SearchPageTypes")
        .clickOnElement(MENU_SELECTORS.MENU.pages)
        .waitForRequestAndCheckIfNoErrors("@SearchPageTypes")
        .then(() => {
          cy.get(PAGES_LIST.createPageButton).should("be.visible");
          cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
            expectConfigurationAvailableSectionsNumber(3);
            expectConfigurationSectionsToBeVisible(
              CONFIGURATION_SELECTORS.taxes,
              CONFIGURATION_SELECTORS.webhooks,
              CONFIGURATION_SELECTORS.pageTypes,
            );
          });
        });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using PLUGIN permission. TC: SALEOR_3409 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.plugin.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(3);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.webhooks,
          CONFIGURATION_SELECTORS.plugin,
        );
        cy.addAliasToGraphRequest("Plugins")
          .clickOnElement(CONFIGURATION_SELECTORS.plugin)
          .waitForRequestAndCheckIfNoErrors("@Plugins");
        cy.get(PLUGINS_LIST.pluginRow).should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using PRODUCT TYPE AND ATTRIBUTE permission. TC: SALEOR_3411 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest(
        "auth",
        PERMISSIONS_OPTIONS.productTypeAndAttribute.user,
      ).visit(urlList.homePage);
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(4);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.productTypes,
          CONFIGURATION_SELECTORS.attributes,
          CONFIGURATION_SELECTORS.webhooks,
        );

        cy.addAliasToGraphRequest("ProductTypeList")
          .clickOnElement(CONFIGURATION_SELECTORS.productTypes)
          .waitForRequestAndCheckIfNoErrors("@ProductTypeList");
        cy.get(PRODUCT_TYPES_LIST.addProductTypeButton).should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using PAGE TYPE AND ATTRIBUTE permission. TC: SALEOR_3412 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest(
        "auth",
        PERMISSIONS_OPTIONS.pageTypeAndAttribute.user,
      ).visit(urlList.homePage);
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(4);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.attributes,
          CONFIGURATION_SELECTORS.webhooks,
          CONFIGURATION_SELECTORS.pageTypes,
        );

        cy.addAliasToGraphRequest("PageTypeList")
          .clickOnElement(CONFIGURATION_SELECTORS.pageTypes)
          .waitForRequestAndCheckIfNoErrors("@PageTypeList");
        cy.get(PAGE_TYPES_LIST.createPageTypeButton).should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using SETTINGS permission. TC: SALEOR_3413 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.settings.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(3);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.settings,
          CONFIGURATION_SELECTORS.webhooks,
        );

        cy.addAliasToGraphRequest("SiteSettings")
          .clickOnElement(CONFIGURATION_SELECTORS.settings)
          .waitForRequestAndCheckIfNoErrors("@SiteSettings");
        cy.get(ADDRESS_SELECTORS.companyInfoSection)
          .scrollIntoView()
          .should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using STAFF permission. TC: SALEOR_3414 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.staff.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(4);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.permissionGroups,
          CONFIGURATION_SELECTORS.staffMembers,
          CONFIGURATION_SELECTORS.webhooks,
        );

        cy.addAliasToGraphRequest("StaffList")
          .clickOnElement(CONFIGURATION_SELECTORS.staffMembers)
          .waitForRequestAndCheckIfNoErrors("@StaffList");
        cy.get(STAFF_MEMBERS_LIST.inviteStaffMemberButton).should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using SHIPPING permission. TC: SALEOR_3415 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.shipping.user).visit(
        urlList.homePage,
      );
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.configuration).then(() => {
        expectConfigurationAvailableSectionsNumber(3);
        expectConfigurationSectionsToBeVisible(
          CONFIGURATION_SELECTORS.taxes,
          CONFIGURATION_SELECTORS.shipping,
          CONFIGURATION_SELECTORS.webhooks,
        );

        cy.addAliasToGraphRequest("ShippingZones")
          .clickOnElement(CONFIGURATION_SELECTORS.shipping)
          .waitForRequestAndCheckIfNoErrors("@ShippingZones");
        cy.get(SHIPPING_ZONES_LIST.addShippingZone).should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using TRANSLATION permission. TC: SALEOR_3416 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest(
        "auth",
        PERMISSIONS_OPTIONS.translations.user,
      ).visit(urlList.homePage);
      expectMainMenuAvailableSections(2);

      cy.clickOnElement(MENU_SELECTORS.MENU.translations).then(() => {
        cy.get(LANGUAGES_LIST.translationListView).should("be.visible");
      });
    },
  );
  it(
    `should be able to navigate through shop as a staff member using PRODUCT permission. TC: SALEOR_3410 `,
    { tags: tagsList },
    () => {
      cy.loginUserViaRequest("auth", PERMISSIONS_OPTIONS.product.user).visit(
        urlList.homePage,
      );
      cy.addAliasToGraphRequest("ProductList")
        .clickOnElement(MENU_SELECTORS.MENU.products)
        .waitForRequestAndCheckIfNoErrors("@ProductList")
        .then(() => {
          cy.get(MENU_SELECTORS.CATALOG.products).last().should("be.visible");
          cy.get(MENU_SELECTORS.CATALOG.categories).should("be.visible");
          cy.get(MENU_SELECTORS.CATALOG.collections).should("be.visible");
          expectMainMenuAvailableSections(6);
        });
      // TODO add next assertion and page check
    },
  );
});
