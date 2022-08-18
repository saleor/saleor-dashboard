/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import * as channelsUtils from "../../../support/api/utils/channelsUtils";
import { deleteSalesStartsWith } from "../../../support/api/utils/discounts/salesUtils";
import * as productsUtils from "../../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith,
} from "../../../support/api/utils/shippingUtils";
import {
  createSaleWithNewVariant,
  discountOptions,
} from "../../../support/pages/discounts/salesPage";

xdescribe("Sales discounts for variant", () => {
  const startsWith = "SalesVar-";

  let productType;
  let attribute;
  let category;
  let defaultChannel;
  let warehouse;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteSalesStartsWith(startsWith);
    productsUtils.deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);

    const name = `${startsWith}${faker.datatype.number()}`;
    productsUtils
      .createTypeAttributeAndCategoryForProduct({ name })
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp,
        }) => {
          productType = productTypeResp;
          attribute = attributeResp;
          category = categoryResp;

          channelsUtils.getDefaultChannel();
        },
      )
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addresses => {
        createShipping({
          channelId: defaultChannel.id,
          name,
          address: addresses.plAddress,
          price: 100,
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should not be able see product variant discount not assigned to channel. TC: SALEOR_1804",
    { tags: ["@sales", "@allEnv", "@stable"] },
    () => {
      const productName = `${startsWith}${faker.datatype.number()}`;
      const name = `${startsWith}${faker.datatype.number()}`;

      let variantNotOnSale;
      let variantOnSale;

      productData.name = productName;
      productData.sku = productName;
      createProductInChannel(productData)
        .then(({ product, variantsList }) => {
          variantNotOnSale = variantsList;
          productData.name = name;
          productData.sku = name;
          productData.productId = product.id;
          productData.quantityInWarehouse = 10;
          productData.attributeName = "value2";
          createVariant(productData);
        })
        .then(variantsList => {
          variantOnSale = variantsList;
          updateSale({ saleId: sale.id, variants: variantOnSale });
        })
        .then(() => {
          createCheckout({
            channelSlug: channel.slug,
            email: "example@example.com",
            address,
            variantsList: variantOnSale.concat(variantNotOnSale),
          });
        })
        .then(({ checkout }) => {
          const variantRespNotOnSale = checkout.lines.find(
            element => element.variant.id === variantNotOnSale[0].id,
          ).variant;
          const variantRespOnSale = checkout.lines.find(
            element => element.variant.id === variantOnSale[0].id,
          ).variant;
          expect(variantRespNotOnSale.pricing.onSale).to.be.false;
          expect(variantRespOnSale.pricing.onSale).to.be.true;
          expect(variantRespNotOnSale.pricing.price.gross.amount).to.eq(
            productData.price,
          );
          expect(variantRespOnSale.pricing.price.gross.amount).to.eq(
            productData.price - saleValue,
          );
        });
    },
  );

  it(
    "should be able to create percentage discount. TC: SALEOR_1807",
    { tags: ["@sales", "@allEnv"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountValue = 50;
      const productPrice = 100;

      createSaleWithNewVariant({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.PERCENTAGE,
        discountValue,
      }).then(({ pricing }) => {
        const priceInResponse = pricing.price.gross.amount;
        const expectedPrice = (productPrice * discountValue) / 100;
        expect(expectedPrice).to.be.eq(priceInResponse);
      });
    },
  );

  it(
    "should be able to create fixed price discount. TC: SALEOR_1808",
    { tags: ["@sales", "@allEnv"] },
    () => {
      const saleName = `${startsWith}${faker.datatype.number()}`;
      const discountValue = 50;
      const productPrice = 100;

      createSaleWithNewVariant({
        name: saleName,
        channel: defaultChannel,
        warehouseId: warehouse.id,
        productTypeId: productType.id,
        attributeId: attribute.id,
        categoryId: category.id,
        price: productPrice,
        discountOption: discountOptions.FIXED,
        discountValue,
      }).then(({ pricing }) => {
        const priceInResponse = pricing.price.gross.amount;
        const expectedPrice = productPrice - discountValue;
        expect(expectedPrice).to.be.eq(priceInResponse);
      });
    },
  );
});
