/// <reference types="cypress"/>
/// <reference types="../support"/>

import {
  ADDRESS_SELECTORS,
  APPS_LIST_SELECTORS,
  CATEGORIES_LIST_SELECTORS,
  CHANNELS_SELECTORS,
  COLLECTION_SELECTORS,
  CONFIGURATION_SELECTORS,
  CUSTOMERS_LIST_SELECTORS,
  DRAFT_ORDERS_LIST_SELECTORS,
  LANGUAGES_LIST_SELECTORS,
  MENU_SELECTORS,
  ORDERS_SELECTORS,
  PAGE_TYPES_LIST_SELECTORS,
  PAGES_LIST_SELECTORS,
  PERMISSION_GROUP_LIST_SELECTORS,
  PLUGINS_LIST_SELECTORS,
  PRODUCT_TYPES_LIST_SELECTORS,
  SHIPPING_ZONES_LIST_SELECTORS,
  STAFF_MEMBERS_LIST_SELECTORS,
  VOUCHERS_SELECTORS,
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

describe("As a staff user I want to navigate through shop using different permissions - migration in progress - to delete when done", () => {
  it(
    `should be able to navigate through shop as a staff member using DISCOUNTS permission. TC: SALEOR_3405a - sales list`,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.discount.user);
      cy.addAliasToGraphRequest("SaleList")
        .clickOnElement(MENU_SELECTORS.MENU.discounts)
        .waitForRequestAndCheckIfNoErrors("@SaleList");
    },
  );
  it(
    `should be able to navigate through shop as a staff member using DISCOUNTS permission. TC: SALEOR_3405b - voucher list`,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("VoucherList")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.discount.user)
        .visit(urlList.vouchers)
        .waitForRequestAndCheckIfNoErrors("@VoucherList");
      cy.checkIfElementIsVisible(VOUCHERS_SELECTORS.createVoucherButton);
    },
  );

  it(
    `should be able to navigate through shop as a staff member using ORDER permission. TC: SALEOR_3407a - order list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.order.user);
      cy.addAliasToGraphRequest("OrderList")
        .clickOnElement(MENU_SELECTORS.MENU.orders)
        .waitForRequestAndCheckIfNoErrors("@OrderList")
        .then(() => {
          expectMainMenuAvailableSections(3);
          expectMainMenuSectionsToBeVisible(
            MENU_SELECTORS.ORDERS.orders,
            MENU_SELECTORS.ORDERS.draftOrders,
          );
          cy.get(MENU_SELECTORS.ORDERS.orders)
            .last()
            .click()
            .then(() => {
              cy.checkIfElementIsVisible(ORDERS_SELECTORS.createOrderButton);
            });
        });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using ORDER permission. TC: SALEOR_3407b - draft list`,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("OrderDraftList")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.order.user)
        .visit(urlList.draftOrders)
        .waitForRequestAndCheckIfNoErrors("@OrderDraftList");
      expectMainMenuAvailableSections(3);
      cy.checkIfElementIsVisible(
        DRAFT_ORDERS_LIST_SELECTORS.createDraftOrderButton,
      );
    },
  );

  it(
    `should be able to navigate through shop as a staff member using APP permission. TC: SALEOR_3402 - app list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.app.user);
      expectMainMenuAvailableSections(2);
      cy.addAliasToGraphRequest("AppsList")
        .clickOnElement(MENU_SELECTORS.MENU.app)
        .waitForRequestAndCheckIfNoErrors("@AppsList")
        .then(() => {
          cy.checkIfElementIsVisible(
            APPS_LIST_SELECTORS.createExternalAppButton,
          );
        });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using CHANNEL permission. TC: SALEOR_3403 - channels list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.channel.user);
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
        cy.checkIfElementIsVisible(CHANNELS_SELECTORS.createChannelButton);
      });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using CHANNEL permission. TC: SALEOR_3403b - webhooks and events `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("AppsList")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.channel.user)
        .visit(urlList.webhooksAndEvents)
        .waitForRequestAndCheckIfNoErrors("@AppsList");
      expectMainMenuAvailableSections(2);
      cy.checkIfElementIsVisible(APPS_LIST_SELECTORS.createLocalAppButton);
    },
  );

  it(
    `should be able to navigate through shop as a staff member using CUSTOMER permission. TC: SALEOR_3404 - customer list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.customer.user);
      expectMainMenuAvailableSections(2);
      cy.addAliasToGraphRequest("ListCustomers")
        .clickOnElement(MENU_SELECTORS.MENU.customers)
        .waitForRequestAndCheckIfNoErrors("@ListCustomers")
        .then(() => {
          cy.checkIfElementIsVisible(
            CUSTOMERS_LIST_SELECTORS.createCustomerButton,
          );
        });
    },
  );

  // //TODO fix when permissions bug is fixed
  it.skip(
    `should be able to navigate through shop as a staff member using GIFT CARD permission. TC: SALEOR_3406 - gift cards `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
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
    `should be able to navigate through shop as a staff member using PAGE permission. TC: SALEOR_3408 - page list`,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.page.user);
      expectMainMenuAvailableSections(3);
      expectMainMenuSectionsToBeVisible(MENU_SELECTORS.MENU.pages);
      cy.addAliasToGraphRequest("SearchPageTypes")
        .clickOnElement(MENU_SELECTORS.MENU.pages)
        .waitForRequestAndCheckIfNoErrors("@SearchPageTypes")
        .then(() => {
          cy.checkIfElementIsVisible(PAGES_LIST_SELECTORS.createPageButton);
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
    `should be able to navigate through shop as a staff member using PAGE - permission. TC: SALEOR_3408b - page types list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("PageTypeList")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.page.user)
        .visit(urlList.pageTypes)
        .waitForRequestAndCheckIfNoErrors("@PageTypeList");
      expectMainMenuAvailableSections(3);
      cy.checkIfElementIsVisible(
        PAGE_TYPES_LIST_SELECTORS.createPageTypeButton,
      );
    },
  );

  it(
    `should be able to navigate through shop as a staff member using PLUGIN permission. TC: SALEOR_3409 - plugins list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.plugin.user);
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
        cy.checkIfElementIsVisible(PLUGINS_LIST_SELECTORS.pluginRow);
      });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using PRODUCT TYPE AND ATTRIBUTE permission. TC: SALEOR_3411 - product type list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(
        PERMISSIONS_OPTIONS.productTypeAndAttribute.user,
      );
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
        cy.checkIfElementIsVisible(
          PRODUCT_TYPES_LIST_SELECTORS.addProductTypeButton,
        );
      });
    },
  );

  // //TODO fix when permissions bug is fixed
  it.skip(
    `should be able to navigate through shop as a staff member using PRODUCT TYPE AND ATTRIBUTE permission. TC: SALEOR_3411b - attribute list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("AttributeList")
        .loginUserViaRequest(
          "auth",
          PERMISSIONS_OPTIONS.productTypeAndAttribute.user,
        )
        .visit(urlList.attributes)
        .waitForRequestAndCheckIfNoErrors("@AttributeList");
      // expectMainMenuAvailableSections(2);
      cy.checkIfElementIsVisible(ATTRIBUTES_LIST.createAttributeButton);
    },
  );

  it(
    `should be able to navigate through shop as a staff member using PAGE TYPE AND ATTRIBUTE permission. TC: SALEOR_3412 - page type list`,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(
        PERMISSIONS_OPTIONS.pageTypeAndAttribute.user,
      );
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
        cy.checkIfElementIsVisible(
          PAGE_TYPES_LIST_SELECTORS.createPageTypeButton,
        );
      });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using SETTINGS permission. TC: SALEOR_3413 - company settings `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.settings.user);
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
    `should be able to navigate through shop as a staff member using STAFF permission. TC: SALEOR_3414 - staff list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.staff.user);
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
        cy.checkIfElementIsVisible(
          STAFF_MEMBERS_LIST_SELECTORS.inviteStaffMemberButton,
        );
      });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using STAFF permission. TC: SALEOR_3414b  - permission group `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("PermissionGroupList")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.staff.user)
        .visit(urlList.permissionsGroups)
        .waitForRequestAndCheckIfNoErrors("@PermissionGroupList");
      expectMainMenuAvailableSections(2);
      cy.checkIfElementIsVisible(
        PERMISSION_GROUP_LIST_SELECTORS.createPermissionButton,
      );
    },
  );

  it(
    `should be able to navigate through shop as a staff member using SHIPPING permission. TC: SALEOR_3415 - shipping zones `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.shipping.user);
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
        cy.checkIfElementIsVisible(
          SHIPPING_ZONES_LIST_SELECTORS.addShippingZone,
        );
      });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using TRANSLATION permission. TC: SALEOR_3416 - translations list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.translations.user);
      expectMainMenuAvailableSections(2);
      cy.clickOnElement(MENU_SELECTORS.MENU.translations).then(() => {
        cy.checkIfElementIsVisible(
          LANGUAGES_LIST_SELECTORS.translationListView,
        );
      });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using PRODUCT permission. TC: SALEOR_3410a - products list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.visitHomePageLoggedViaApi(PERMISSIONS_OPTIONS.product.user);
      cy.addAliasToGraphRequest("ProductList")
        .clickOnElement(MENU_SELECTORS.MENU.products)
        .waitForRequestAndCheckIfNoErrors("@ProductList")
        .then(() => {
          cy.get(MENU_SELECTORS.CATALOG.products).last().should("be.visible");
          cy.get(MENU_SELECTORS.CATALOG.categories).should("be.visible");
          cy.get(MENU_SELECTORS.CATALOG.collections).should("be.visible");
          expectMainMenuAvailableSections(5);
        });
    },
  );

  it(
    `should be able to navigate through shop as a staff member using PRODUCT permission. TC: SALEOR_3410b - categories list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("RootCategories")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.product.user)
        .visit(urlList.categories)
        .waitForRequestAndCheckIfNoErrors("@RootCategories");
      expectMainMenuAvailableSections(5);
      cy.checkIfElementIsVisible(CATEGORIES_LIST_SELECTORS.addCategoryButton);
    },
  );

  it(
    `should be able to navigate through shop as a staff member using PRODUCT permission. TC: SALEOR_3410c - collections list `,
    { tags: ["@allEnv", "@navigation", "@stable", "@oldRelease", "@critical"] },
    () => {
      cy.addAliasToGraphRequest("CollectionList")
        .loginUserViaRequest("auth", PERMISSIONS_OPTIONS.product.user)
        .visit(urlList.collections)
        .waitForRequestAndCheckIfNoErrors("@CollectionList");
      expectMainMenuAvailableSections(5);
      cy.checkIfElementIsVisible(COLLECTION_SELECTORS.createCollectionButton);
    },
  );
});
