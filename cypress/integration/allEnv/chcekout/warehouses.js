import { cycleErrorMessage } from "graphql/validation/rules/NoFragmentCycles";

import { createCheckout } from "../../../apiRequests/Checkout";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct
} from "../../../utils/products/productsUtils";
import { createShipping } from "../../../utils/shippingUtils";

describe("Warehouses in checkout", () => {
  const channelStartsWith = `CyWarehouseInCheckout:`;
  let defaultChannel;
  let usAddress;
  let plAddress;
  let warehouse;
  it("should not be possible to buy product for country not listed in warehouse", () => {
    const name = `${channelStartsWith} ${faker.datatype.number(2)}`;
    cycleErrorMessage
      .fixture("addresses")
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
          usAddress
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
          warehouseId: warehouse.id
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
      .then(checkout => {
        expect(checkout.availableShippingMethods).to.be.null;
      });
  });
});
