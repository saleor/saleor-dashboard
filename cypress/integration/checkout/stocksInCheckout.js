/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  addProductsToCheckout,
  createCheckout
} from "../../support/api/requests/Checkout";
import { getVariants } from "../../support/api/requests/Product";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import { createOrderWithNewProduct } from "../../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all", "critical"] }, () => {
  describe("Products stocks in checkout", () => {
    const startsWith = "CyStocksCheckout-";
    const name = `${startsWith}${faker.datatype.number()}`;

    let defaultChannel;
    let address;
    let warehouse;
    let attribute;
    let category;
    let productType;
    let shippingMethod;

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
            address
          });
        })
        .then(
          ({
            warehouse: warehouseResp,
            shippingMethod: shippingMethodResp
          }) => {
            warehouse = warehouseResp;
            shippingMethod = shippingMethodResp;
            createTypeAttributeAndCategoryForProduct({ name });
          }
        )
        .then(
          ({
            attribute: attributeResp,
            category: categoryResp,
            productType: productTypeResp
          }) => {
            attribute = attributeResp;
            category = categoryResp;
            productType = productTypeResp;
          }
        );
    });
    it("should create checkout with last product in stock", () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      createOrderWithNewProduct({
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productType.id,
        channel: defaultChannel,
        name: productName,
        warehouseId: warehouse.id,
        shippingMethod,
        address
      }).then(({ order }) => {
        expect(order, "order should be created").to.be.ok;
      });
    });

    it("should not be possible to add product with quantity greater than stock", () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      let variants;

      createProductInChannel({
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productType.id,
        channelId: defaultChannel.id,
        name: productName,
        warehouseId: warehouse.id,
        quantityInWarehouse: 1
      })
        .then(({ variantsList }) => {
          variants = variantsList;
          createCheckout({
            channelSlug: defaultChannel.slug,
            address,
            billingAddress: address,
            email: "email@example.com",
            variantsList,
            auth: "token"
          });
        })
        .then(({ checkout: checkout }) => {
          addProductsToCheckout(checkout.id, variants, 2);
        })
        .then(({ errors }) => {
          expect(
            errors[0],
            "should return error on field quantity"
          ).to.have.property("field", "quantity");
        });
    });

    it("should buy product with no quantity if tracking is not set", () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      createOrderWithNewProduct({
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productType.id,
        channel: defaultChannel,
        name: productName,
        warehouseId: warehouse.id,
        quantityInWarehouse: 0,
        trackInventory: false,
        shippingMethod,
        address
      }).then(({ order }) => {
        expect(order, "order should be created").to.be.ok;
      });
    });

    it("should change product stock after purchase", () => {
      const productName = `${startsWith}${faker.datatype.number()}`;

      createOrderWithNewProduct({
        attributeId: attribute.id,
        categoryId: category.id,
        productTypeId: productType.id,
        channel: defaultChannel,
        name: productName,
        warehouseId: warehouse.id,
        quantityInWarehouse: 10,
        trackInventory: true,
        shippingMethod,
        address
      })
        .then(({ variantsList }) => {
          getVariants(variantsList);
        })
        .then(variantsList => {
          const variant = variantsList.edges[0];
          expect(variant.node.stocks[0].quantityAllocated).to.eq(1);
        });
    });
  });
});
