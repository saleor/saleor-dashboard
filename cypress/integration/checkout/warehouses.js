/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { createCheckout } from "../../support/api/requests/Checkout";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
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
import {
  pickupOptions,
  visitAndEnablePickup,
  visitSetPublicStockAndEnablePickup
} from "../../support/pages/warehousePage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Warehouses in checkout", () => {
    const startsWith = `CyWarehouseCheckout`;
    let defaultChannel;
    let usAddress;
    let plAddress;
    let productData;
    let checkoutData;
    let variantsInOtherWarehouse;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteShippingStartsWith(startsWith);
      deleteProductsStartsWith(startsWith);
      cy.fixture("addresses")
        .then(addresses => {
          usAddress = addresses.usAddress;
          plAddress = addresses.plAddress;
          getDefaultChannel();
        })
        .then(channelResp => {
          defaultChannel = channelResp;
          createTypeAttributeAndCategoryForProduct({ name: startsWith });
        })
        .then(({ attribute, productType, category }) => {
          productData = {
            attributeId: attribute.id,
            categoryId: category.id,
            channelId: defaultChannel.id,
            productTypeId: productType.id,
            quantityInWarehouse: 100
          };
          checkoutData = {
            returnAvailableCollectionPoints: true,
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            address: plAddress
          };
          createShipping({
            channelId: defaultChannel.id,
            name: startsWith,
            address: plAddress
          });
        })
        .then(({ warehouse: warehouseResp }) => {
          productData.name = startsWith;
          productData.warehouseId = warehouseResp.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          variantsInOtherWarehouse = variantsList;
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create warehouse with all warehouses pickup and private stock", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: plAddress
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          visitAndEnablePickup(warehouse.id);
          productData.name = name;
          productData.warehouseId = warehouse.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList.concat(
            variantsInOtherWarehouse
          );
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          const clickAndCollectOption = checkout.availableCollectionPoints[0];
          expect(clickAndCollectOption.clickAndCollectOption).to.eq("ALL");
          expect(clickAndCollectOption.id).to.eq(warehouse.id);
          expect(clickAndCollectOption.isPrivate).to.eq(true);
          expect(clickAndCollectOption.name).to.eq(warehouse.name);
        });
    });

    it("should create warehouse with all warehouses pickup and public stock", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: plAddress
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          visitSetPublicStockAndEnablePickup(warehouse.id);
          productData.name = name;
          productData.warehouseId = warehouse.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList.concat(
            variantsInOtherWarehouse
          );
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          const clickAndCollectOption = checkout.availableCollectionPoints[0];
          expect(clickAndCollectOption.clickAndCollectOption).to.eq("ALL");
          expect(clickAndCollectOption.id).to.eq(warehouse.id);
          expect(clickAndCollectOption.isPrivate).to.eq(false);
          expect(clickAndCollectOption.name).to.eq(warehouse.name);
        });
    });

    it("should create warehouse with local stock only pickup and public stock", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;
      let variantsInLocalStock;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: plAddress
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          visitSetPublicStockAndEnablePickup(warehouse.id, pickupOptions.local);
          productData.name = name;
          productData.warehouseId = warehouse.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          variantsInLocalStock = variantsList;
          checkoutData.variantsList = variantsInLocalStock.concat(
            variantsInOtherWarehouse
          );
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          expect(checkout.availableCollectionPoints).to.have.length(
            0,
            "there should be no available collection point"
          );
          checkoutData.variantsList = variantsInLocalStock;
          createCheckout(checkoutData);
        })
        .then(({ checkout }) => {
          const clickAndCollectOption = checkout.availableCollectionPoints[0];
          expect(clickAndCollectOption.clickAndCollectOption).to.eq("LOCAL");
          expect(clickAndCollectOption.id).to.eq(warehouse.id);
          expect(clickAndCollectOption.isPrivate).to.eq(false);
          expect(clickAndCollectOption.name).to.eq(warehouse.name);
        });
    });

    it("should not be possible to buy product for country not listed in warehouse", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: usAddress
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          productData.name = name;
          productData.warehouseId = warehouse.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList;
          createCheckout(checkoutData);
        })
        .then(({ errors }) => {
          expect(errors[0]).to.have.property("field", "quantity");
        });
    });
  });
});
