import faker from "faker";

import { createCheckout } from "../../../apiRequests/Checkout";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../utils/shippingUtils";

describe("Warehouses in checkout", () => {
  const startsWith = `CyWarehouseCheckout`;
  let defaultChannel;
  let usAddress;
  let plAddress;
  let warehouse;

  it("should not be possible to buy product for country not listed in warehouse", () => {
    cy.clearSessionData().loginUserViaRequest();
    deleteShippingStartsWith(startsWith);
    deleteProductsStartsWith(startsWith);
    const name = `${startsWith}${faker.datatype.number()}`;
    cy.fixture("addresses")
      .then(addresses => {
        usAddress = addresses.usAddress;
        plAddress = addresses.plAddress;
        getDefaultChannel();
      })
      .then(channelResp => {
        defaultChannel = channelResp;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address: usAddress
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        createTypeAttributeAndCategoryForProduct(name);
      })
      .then(({ attribute, productType, category }) => {
        createProductInChannel({
          name,
          attributeId: attribute.id,
          categoryId: category.id,
          channelId: defaultChannel.id,
          productTypeId: productType.id,
          warehouseId: warehouse.id,
          quantityInWarehouse: 100
        });
      })
      .then(({ variantsList }) => {
        createCheckout({
          channelSlug: defaultChannel.slug,
          email: "example@example.com",
          variantsList,
          address: plAddress
        });
      })
      .then(({ errors }) => {
        expect(errors[0]).to.have.property("field", "quantity");
      });
  });
});
