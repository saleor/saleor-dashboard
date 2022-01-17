/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { SALES_SELECTORS } from "../../elements/discounts/sales";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { saleDetailsUrl } from "../../fixtures/urlList";
import { createCheckout } from "../../support/api/requests/Checkout";
import { updateSale } from "../../support/api/requests/Discounts/Sales";
import { createVariant, getVariant } from "../../support/api/requests/Product";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import {
  createSaleInChannel,
  createSaleInChannelWithProduct,
  deleteSalesStartsWith
} from "../../support/api/utils/discounts/salesUtils";
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

filterTests({ definedTags: ["all"] }, () => {
  describe("Create sale with assigned products", () => {
    const startsWith = "CySales";
    const saleValue = 10;

    let channel;
    let sale;
    let warehouse;
    let address;
    let productData;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteProductsStartsWith(startsWith);
      deleteShippingStartsWith(startsWith);
      deleteSalesStartsWith(startsWith);
      getDefaultChannel()
        .then(defaultChannel => {
          channel = defaultChannel;
          createSaleInChannel({
            name: startsWith,
            type: "FIXED",
            value: saleValue,
            channelId: channel.id
          });
        })
        .then(saleResp => (sale = saleResp));
      cy.fixture("addresses")
        .then(addresses => {
          address = addresses.usAddress;
          createShipping({
            channelId: channel.id,
            address,
            name: startsWith
          });
        })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
        });
      createTypeAttributeAndCategoryForProduct({
        name: startsWith,
        attributeValues: ["value1", "value2"]
      }).then(({ attribute, category, productType }) => {
        productData = {
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id,
          channelId: channel.id,
          warehouseId: warehouse.id,
          price: 30
        };
      });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should discount only variants added to sale", () => {
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
            variantsList: variantOnSale.concat(variantNotOnSale)
          });
        })
        .then(({ checkout }) => {
          const variantRespNotOnSale = checkout.lines.find(
            element => element.variant.id === variantNotOnSale[0].id
          ).variant;
          const variantRespOnSale = checkout.lines.find(
            element => element.variant.id === variantOnSale[0].id
          ).variant;
          expect(variantRespNotOnSale.pricing.onSale).to.be.false;
          expect(variantRespOnSale.pricing.onSale).to.be.true;
          expect(variantRespNotOnSale.pricing.price.gross.amount).to.eq(
            productData.price
          );
          expect(variantRespOnSale.pricing.price.gross.amount).to.eq(
            productData.price - saleValue
          );
        });
    });

    it("should delete sale", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let variants;
      let saleToDelete;
      productData.name = name;
      productData.sku = name;
      createProductInChannel(productData)
        .then(({ variantsList }) => {
          variants = variantsList;
          createSaleInChannelWithProduct({
            name,
            type: "FIXED",
            value: saleValue,
            channelId: channel.id,
            variants
          });
        })
        .then(saleResp => {
          saleToDelete = saleResp;
          getVariant(variants[0].id, channel.slug);
        })
        .then(variantResp => {
          expect(variantResp.pricing.onSale).to.be.true;
          expect(variantResp.pricing.price.gross.amount).to.eq(
            productData.price - saleValue
          );
          cy.visit(saleDetailsUrl(saleToDelete.id))
            .addAliasToGraphRequest("SaleDelete")
            .get(BUTTON_SELECTORS.deleteButton)
            .click()
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@SaleDelete");
          getVariant(variants[0].id, channel.slug);
        })
        .then(variantResp => {
          expect(variantResp.pricing.onSale).to.be.false;
          expect(variantResp.pricing.price.gross.amount).to.eq(
            productData.price
          );
        });
    });

    it("should remove variant from sale", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let product;
      let variants;
      productData.name = name;
      productData.sku = name;
      createProductInChannel(productData)
        .then(({ variantsList, product: productResp }) => {
          product = productResp;
          variants = variantsList;
          updateSale({
            saleId: sale.id,
            variants
          });
        })
        .then(() => {
          getVariant(variants[0].id, channel.slug);
        })
        .then(variantResp => {
          expect(variantResp.pricing.onSale).to.be.true;
          expect(variantResp.pricing.price.gross.amount).to.eq(
            productData.price - saleValue
          );
          cy.visit(saleDetailsUrl(sale.id))
            .get(SALES_SELECTORS.variantsTab)
            .click()
            .addAliasToGraphRequest("SaleCataloguesRemove");
          cy.contains(SHARED_ELEMENTS.tableRow, product.name)
            .find(BUTTON_SELECTORS.button)
            .click()
            .wait("@SaleCataloguesRemove");
          getVariant(variants[0].id, channel.slug);
        })
        .then(variantResp => {
          expect(variantResp.pricing.onSale).to.be.false;
          expect(variantResp.pricing.price.gross.amount).to.eq(
            productData.price
          );
        });
    });
  });
});
