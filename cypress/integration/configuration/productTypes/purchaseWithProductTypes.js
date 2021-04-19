import faker from "faker";

import { completeCheckout } from "../../../apiRequests/Checkout";
import { getOrder } from "../../../apiRequests/Order";
import {
  createProduct,
  createTypeProduct,
  createVariant,
  updateChannelInProduct
} from "../../../apiRequests/Product";
import { createShippingZone } from "../../../apiRequests/ShippingMethod";
import { createWarehouse } from "../../../apiRequests/Warehouse";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import { createCheckout } from "../../../utils/ordersUtils";
import {
  createAttribute,
  createCategory,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";

describe("Purchase products with all products types", () => {
  const startsWith = `CyPurchaseByType`;
  const name = `${startsWith}${faker.datatype.number()}`;

  let defaultChannel;
  let address;
  let warehouse;
  let attribute;
  let category;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    getDefaultChannel().then(channelResp => (defaultChannel = channelResp));
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.plAddress;
        createShippingZone(name, "Pl", defaultChannel.id);
      })
      .then(shippingZoneResp => {
        createWarehouse({ name, address, shippingZone: shippingZoneResp.id });
      })
      .then(warehouseResp => (warehouse = warehouseResp));
    createAttribute(name)
      .then(attributeResp => {
        attribute = attributeResp;
        createCategory(name);
      })
      .then(categoryResp => {
        category = categoryResp;
      });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should purchase digital product", () => {
    let product;
    let checkout;
    const digitalName = `${startsWith}${faker.datatype.number()}`;
    createTypeProduct({
      name: digitalName,
      attributeId: attribute.id,
      shippable: false
    })
      .then(productType => {
        createProduct({
          attributeId: attribute.id,
          name: digitalName,
          productType: productType.id,
          category: category.id
        });
      })
      .then(productResp => {
        product = productResp;
        updateChannelInProduct({
          productId: product.id,
          channelId: defaultChannel.id
        });
      })
      .then(() => {
        createVariant({
          productId: product.id,
          sku: digitalName,
          warehouseId: warehouse.id,
          quantity: 10,
          attributeId: attribute.id,
          channelId: defaultChannel.id,
          price: 10
        });
      })
      .then(variantsList => {
        createCheckout({
          channelSlug: defaultChannel.slug,
          email: `${startsWith}@example.com`,
          address,
          billingAddress: address,
          variantsList,
          auth: "token"
        });
      })
      .then(checkoutResp => {
        checkout = checkoutResp;
        completeCheckout(checkout.id);
      })
      .then(() => {
        getOrder(checkout.id);
      });
  });

  // it("should purchase physical product", () => {

  // })
  // it("should purchase multiple products with all product types", () => {

  // })
});
