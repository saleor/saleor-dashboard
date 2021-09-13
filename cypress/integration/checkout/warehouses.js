import faker from "faker";

import { createCheckout } from "../../apiRequests/Checkout";
import { enablePickup, setPublicStock } from "../../steps/warehouseSteps";
import filterTests from "../../support/filterTests";
import { getDefaultChannel } from "../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";

filterTests(["all"], () => {
  describe("Warehouses in checkout", () => {
    const startsWith = `CyWarehouseCheckout`;
    let defaultChannel;
    let usAddress;
    let plAddress;
    let productData;
    let checkoutData;

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
          createTypeAttributeAndCategoryForProduct(startsWith);
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
        });
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create warehouse with enabled pickup", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: plAddress
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          enablePickup(warehouse.id);
          productData.name = name;
          productData.warehouseId = warehouse.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList;
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

    it("should create warehouse with public stock", () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createShipping({
        channelId: defaultChannel.id,
        name,
        address: plAddress
      })
        .then(({ warehouse: warehouseResp }) => {
          warehouse = warehouseResp;
          setPublicStock(warehouse.id);
          productData.name = name;
          productData.warehouseId = warehouse.id;
          createProductInChannel(productData);
        })
        .then(({ variantsList }) => {
          checkoutData.variantsList = variantsList;
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
