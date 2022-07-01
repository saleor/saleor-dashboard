/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { createCheckout } from "../../support/api/requests/Checkout";
import { updateStockReservation } from "../../support/api/requests/ShopSettings";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith,
} from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../support/api/utils/shippingUtils";
import {
  enterSiteSettingAndSetStockReservation,
  userType,
} from "../../support/pages/siteSettings";

xdescribe("As an admin I want to manage stock reservation", () => {
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
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.usAddress;
        getDefaultChannel();
      })
      .then(channel => {
        defaultChannel = channel;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        createTypeAttributeAndCategoryForProduct({ name });
      })
      .then(
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
  });

  beforeEach(() => {
    const productName = `${startsWith}${faker.datatype.number()}`;

    cy.clearSessionData().loginUserViaRequest();

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
    { tags: ["@orders", "@allEnv"] },
    () => {
      dataForCheckout.auth = customerType.authenticated;

      updateStockReservation({})
        .then(() => {
          enterSiteSettingAndSetStockReservation(userType.authenticated, 10);
          createCheckout(dataForCheckout);
        })
        .then(({ checkout }) => {
          expect(checkout).to.be.ok;
          createCheckout(dataForCheckout);
        })
        .then(resp => {
          expect(resp.errors, "there should be errors in response").to.not.be
            .empty;
          expect(
            resp.errors[0].field,
            "error should be on field quantity",
          ).to.be.eq("quantity");
        });
    },
  );

  it(
    "should be able to set stock reservation for anonymous customer in checkout. TC: SALEOR_0416",
    { tags: ["@orders", "@allEnv"] },
    () => {
      dataForCheckout.auth = customerType.anonymous;

      updateStockReservation({})
        .then(() => {
          enterSiteSettingAndSetStockReservation(userType.anonymous, 10);
          createCheckout(dataForCheckout);
        })
        .then(({ checkout }) => {
          expect(checkout).to.be.ok;
          createCheckout(dataForCheckout);
        })
        .then(resp => {
          expect(resp.errors, "there should be errors in response").to.not.be
            .empty;
          expect(
            resp.errors[0].field,
            "error should be on field quantity",
          ).to.be.eq("quantity");
        });
    },
  );

  it(
    "should be able to leave empty stock reservation for authenticated customer in checkout. TC: SALEOR_0417",
    { tags: ["@orders", "@allEnv"] },
    () => {
      dataForCheckout.auth = customerType.authenticated;

      updateStockReservation({ authenticatedUserStock: 10 })
        .then(() => {
          enterSiteSettingAndSetStockReservation(userType.authenticated);
          createCheckout(dataForCheckout);
        })
        .then(({ checkout }) => {
          expect(checkout).to.be.ok;
          createCheckout(dataForCheckout);
        })
        .then(resp => {
          expect(resp.errors, "there should be no errors in response").to.be
            .empty;
        });
    },
  );

  it(
    "should be able to leave empty stock reservation for anonymous customer in checkout. TC: SALEOR_0418",
    { tags: ["@orders", "@allEnv"] },
    () => {
      dataForCheckout.auth = customerType.anonymous;

      updateStockReservation({ anonymousUserStock: 10 })
        .then(() => {
          enterSiteSettingAndSetStockReservation(userType.anonymous);
          createCheckout(dataForCheckout);
        })
        .then(({ checkout }) => {
          expect(checkout).to.be.ok;
          createCheckout(dataForCheckout);
        })
        .then(resp => {
          expect(resp.errors, "there should be no errors in response").to.be
            .empty;
        });
    },
  );
});
