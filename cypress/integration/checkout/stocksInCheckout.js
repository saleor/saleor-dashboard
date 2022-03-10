/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  addProductsToCheckout,
  createCheckout
} from "../../support/api/requests/Checkout";
import { createVariant, getVariants } from "../../support/api/requests/Product";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import { createWaitingForCaptureOrder } from "../../support/api/utils/ordersUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct
} from "../../support/api/utils/products/productsUtils";
import { createShipping } from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all", "critical", "refactored"] }, () => {
  describe("Manage products stocks in checkout", () => {
    const startsWith = "CyStocksCheckout-";
    const name = `${startsWith}${faker.datatype.number()}`;
    const productName = `${startsWith}${faker.datatype.number()}`;

    let defaultChannel;
    let address;
    let warehouse;
    let attribute;
    let category;
    let productType;
    let shippingMethod;
    let product;
    let variantsWithLowStock;
    let variantsWithoutTrackInventory;
    let lastVariantInStock;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
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
            createTypeAttributeAndCategoryForProduct({
              name,
              attributeValues: ["value", "value3", "value2"]
            });
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
            createProductInChannel({
              attributeId: attribute.id,
              categoryId: category.id,
              productTypeId: productType.id,
              channelId: defaultChannel.id,
              name: productName,
              warehouseId: warehouse.id,
              quantityInWarehouse: 1
            });
          }
        )
        .then(({ variantsList, product: productResp }) => {
          variantsWithLowStock = variantsList;
          product = productResp;
          createVariant({
            productId: product.id,
            attributeId: attribute.id,
            channelId: defaultChannel.id,
            attributeName: "value2",
            trackInventory: false,
            warehouseId: warehouse.id,
            quantityInWarehouse: 0
          });
        })
        .then(variantsList => {
          variantsWithoutTrackInventory = variantsList;
          createVariant({
            productId: product.id,
            attributeId: attribute.id,
            channelId: defaultChannel.id,
            attributeName: "value3",
            warehouseId: warehouse.id
          });
        })
        .then(variantsList => {
          lastVariantInStock = variantsList;
        });
    });

    it("should not be possible to add product with quantity greater than stock to checkout. TC: SALEOR_0405", () => {
      createCheckout({
        channelSlug: defaultChannel.slug,
        address,
        billingAddress: address,
        email: "email@example.com",
        variantsList: variantsWithLowStock,
        auth: "token"
      })
        .then(({ checkout: checkout }) => {
          addProductsToCheckout(checkout.id, variantsWithLowStock, 2);
        })
        .then(({ errors }) => {
          expect(
            errors[0],
            "should return error on field quantity"
          ).to.have.property("field", "quantity");
        });
    });

    it("should buy product with no quantity if tracking is not set. TC: SALEOR_0406", () => {
      createWaitingForCaptureOrder({
        address,
        channelSlug: defaultChannel.slug,
        email: "example@example.com",
        shippingMethodName: shippingMethod.name,
        variantsList: variantsWithoutTrackInventory
      }).then(({ order }) => {
        expect(order, "order should be created").to.be.ok;
      });
    });

    it("should create checkout with last product in stock. TC: SALEOR_0419", () => {
      createWaitingForCaptureOrder({
        address,
        channelSlug: defaultChannel.slug,
        email: "example@example.com",
        shippingMethodName: shippingMethod.name,
        variantsList: lastVariantInStock
      })
        .then(({ order }) => {
          expect(order, "order should be created").to.be.ok;
          getVariants(lastVariantInStock);
        })
        .then(variantsList => {
          const variant = variantsList.edges[0];
          expect(variant.node.stocks[0].quantityAllocated).to.eq(1);
          expect(variant.node.stocks[0].quantity).to.eq(1);
        });
    });
  });
});
