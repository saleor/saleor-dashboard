import faker from "faker";

import { createAttribute } from "../../../apiRequests/Attribute";
import { createCategory } from "../../../apiRequests/Category";
import {
  checkoutShippingAddressUpdate,
  checkoutShippingMethodUpdate,
  checkoutVariantsUpdate,
  completeCheckout,
  createCheckout
} from "../../../apiRequests/Checkout";
import { getOrder } from "../../../apiRequests/Order";
import { createTypeProduct } from "../../../apiRequests/productType";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import {
  addPayment,
  createAndCompleteCheckoutWithoutShipping,
  createWaitingForCaptureOrder
} from "../../../utils/ordersUtils";
import {
  createProductInChannel,
  deleteProductsStartsWith
} from "../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../utils/shippingUtils";

describe("Purchase products with all products types", () => {
  const startsWith = `CyPurchaseByType`;
  const name = `${startsWith}${faker.datatype.number()}`;
  const email = `${startsWith}@example.com`;
  const testsMessage = "Check order status";
  const { softExpect } = chai;

  let defaultChannel;
  let address;
  let warehouse;
  let attribute;
  let category;
  let shippingMethod;
  let createProductData;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    getDefaultChannel().then(channelResp => (defaultChannel = channelResp));
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.usAddress;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address,
          price: 10
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          warehouse = warehouseResp;
          shippingMethod = shippingMethodResp;
        }
      );
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
    createProductData = {
      channelId: defaultChannel.id,
      warehouseId: warehouse.id,
      quantityInWarehouse: 10,
      attributeId: attribute.id,
      categoryId: category.id,
      price: 10
    };
  });

  it("should purchase digital product", () => {
    const digitalName = `${startsWith}${faker.datatype.number()}`;
    createTypeProduct({
      name: digitalName,
      attributeId: attribute.id,
      shippable: false
    })
      .then(productType => {
        createProductData.name = digitalName;
        createProductData.productTypeId = productType.id;
        createProductInChannel(createProductData);
      })
      .then(({ variantsList }) => {
        createAndCompleteCheckoutWithoutShipping({
          channelSlug: defaultChannel.slug,
          email,
          billingAddress: address,
          variantsList,
          auth: "token"
        });
      })
      .then(({ order }) => {
        getOrder(order.id);
      })
      .then(order => {
        softExpect(
          order.isShippingRequired,
          "Check if is shipping required in order"
        ).to.eq(false);
        expect(order.status, testsMessage).to.be.eq("UNFULFILLED");
      });
  });

  it("should purchase physical product", () => {
    const physicalName = `${startsWith}${faker.datatype.number()}`;
    createTypeProduct({
      name: physicalName,
      attributeId: attribute.id,
      shippable: true
    })
      .then(productType => {
        createProductData.name = physicalName;
        createProductData.productTypeId = productType.id;
        createProductInChannel(createProductData);
      })
      .then(({ variantsList }) => {
        createWaitingForCaptureOrder({
          channelSlug: defaultChannel.slug,
          email,
          variantsList,
          shippingMethodId: shippingMethod.id,
          address
        });
      })
      .then(({ order }) => {
        getOrder(order.id);
      })
      .then(order => {
        softExpect(
          order.isShippingRequired,
          "Check if is shipping required in order"
        ).to.eq(true);
        expect(order.status, testsMessage).to.be.eq("UNFULFILLED");
      });
  });
  it("should purchase multiple products with all product types", () => {
    const physicalName = `${startsWith}${faker.datatype.number()}`;
    const digitalName = `${startsWith}${faker.datatype.number()}`;
    let digitalProductVariantsList;
    let checkout;
    createTypeProduct({
      name: digitalName,
      attributeId: attribute.id,
      shippable: false
    })
      .then(productType => {
        createProductData.name = digitalName;
        createProductData.productTypeId = productType.id;
        createProductInChannel(createProductData);
      })
      .then(({ variantsList }) => {
        digitalProductVariantsList = variantsList;
        createCheckout({
          channelSlug: defaultChannel.slug,
          email,
          variantsList: digitalProductVariantsList,
          billingAddress: address,
          auth: "token"
        });
      })
      .then(({ checkout: checkoutResp }) => {
        checkout = checkoutResp;
        addPayment(checkout.id);
      })
      .then(() => {
        createTypeProduct({
          name: physicalName,
          attributeId: attribute.id,
          shippable: true
        });
      })
      .then(productType => {
        createProductData.name = physicalName;
        createProductData.productTypeId = productType.id;
        createProductInChannel(createProductData);
      })
      .then(({ variantsList }) => {
        checkoutVariantsUpdate(checkout.id, variantsList);
      })
      .then(() => {
        checkoutShippingMethodUpdate(checkout.id, shippingMethod.id);
      })
      .then(({ checkoutErrors }) => {
        expect(
          checkoutErrors,
          "Should be not possible to add shipping method without shipping address"
        ).to.have.lengthOf(1);
        checkoutShippingAddressUpdate(checkout.id, address);
      })
      .then(() => {
        addPayment(checkout.id);
      })
      .then(({ paymentErrors }) => {
        expect(
          paymentErrors,
          "Should be not possible to add payment without shipping"
        ).to.have.lengthOf(1);
        checkoutShippingMethodUpdate(checkout.id, shippingMethod.id);
      })
      .then(() => {
        addPayment(checkout.id);
      })
      .then(() => {
        completeCheckout(checkout.id);
      })
      .then(({ order }) => {
        getOrder(order.id);
      })
      .then(order => {
        softExpect(
          order.isShippingRequired,
          "Check if is shipping required in order"
        ).to.eq(true);
        expect(order.status, testsMessage).to.be.eq("UNFULFILLED");
      });
  });
});
