/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { createCheckout } from "../../support/api/requests/Checkout";
import {
  updateStockReservation,
} from "../../support/api/requests/ShopSettings";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
} from "../../support/api/utils/products/productsUtils";
import { createShipping } from "../../support/api/utils/shippingUtils";
import {
  enterSiteSettingAndSetStockReservation,
  userType,
} from "../../support/pages/siteSettings";

describe("As an admin I want to manage stock reservation", () => {
  const startsWith = "manageStocks";
  const name = `${startsWith}${faker.datatype.number()}`;
  const productQuantity = 10;
  const customerType = {
    authenticated: "auth",
    anonymous: "token",
  };

  let defaultChannel;
  let address;
  let warehouse;
  let attribute;
  let category;
  let productType;
  let dataForCheckout;

  before(() => {
    cy.loginUserViaRequest();

    cy.fixture("addresses").then(addresses => {
      address = addresses.usAddress;

      getDefaultChannel().then(channel => {
        defaultChannel = channel;

        createShipping({
          channelId: defaultChannel.id,
          name,
          address,
        }).then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;

          createTypeAttributeAndCategoryForProduct({ name }).then(
            ({
              attribute: attributeResp,
              category: categoryResp,
              productType: productTypeResp,
            }) => {
              attribute = attributeResp;
              category = categoryResp;
              productType = productTypeResp;
            },
          );
          cy.checkIfDataAreNotNull({
            defaultChannel,
            address,
            warehouse,
            attribute,
            category,
            productType,
            dataForCheckout,
          });
        });
      });
    });
  });

  after(() => {
    updateStockReservation({}).its("errors").should("be.empty");
  });

  beforeEach(() => {
    const productName = `${startsWith}${faker.datatype.number()}`;

    cy.loginUserViaRequest();

    createProductInChannel({
      attributeId: attribute.id,
      categoryId: category.id,
      channelId: defaultChannel.id,
      name: productName,
      productTypeId: productType.id,
      warehouseId: warehouse.id,
      quantityInWarehouse: productQuantity,
    }).then(({ variantsList }) => {
      dataForCheckout = {
        email: "example@example.pl",
        address,
        channelSlug: defaultChannel.slug,
        variantsList,
        productQuantity,
      };
    });
  });

  it(
    "should be able to set stock reservation for authenticated customer in checkout. TC: SALEOR_0415",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      dataForCheckout.auth = customerType.authenticated;

      updateStockReservation({});
      enterSiteSettingAndSetStockReservation(userType.authenticated, 10);
      createCheckout(dataForCheckout).its("checkout").should("be.ok");
      createCheckout(dataForCheckout)
        .its("errors.0")
        .should("include", { field: "quantity" })
        .and("include", {
          message: "Could not add items value. Only 0 remaining in stock.",
        });
    },
  );

  it(
    "should be able to set stock reservation for anonymous customer in checkout. TC: SALEOR_0416",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      dataForCheckout.auth = customerType.anonymous;

      updateStockReservation({});
      enterSiteSettingAndSetStockReservation(userType.anonymous, 10);
      createCheckout(dataForCheckout).its("checkout").should("be.ok");
      createCheckout(dataForCheckout)
        .its("errors.0")
        .should("include", { field: "quantity" })
        .and("include", {
          message: "Could not add items value. Only 0 remaining in stock.",
        });
    },
  );

  it(
    "should be able to leave empty stock reservation for authenticated customer in checkout. TC: SALEOR_0417",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      dataForCheckout.auth = customerType.authenticated;

      updateStockReservation({ authenticatedUserStock: 10 });
      enterSiteSettingAndSetStockReservation(userType.authenticated);
      createCheckout(dataForCheckout).its("checkout").should("be.ok");
      createCheckout(dataForCheckout)
        .should("be.ok")
        .its("errors")
        .should("be.empty");
    },
  );

  it(
    "should be able to leave empty stock reservation for anonymous customer in checkout. TC: SALEOR_0418",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      dataForCheckout.auth = customerType.anonymous;

      updateStockReservation({ anonymousUserStock: 10 });
      enterSiteSettingAndSetStockReservation(userType.anonymous);
      createCheckout(dataForCheckout).its("checkout").should("be.ok");
      createCheckout(dataForCheckout)
        .should("be.ok")
        .its("errors")
        .should("be.empty");
    },
  );
});
