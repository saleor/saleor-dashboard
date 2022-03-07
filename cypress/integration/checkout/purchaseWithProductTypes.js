/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { createAttribute } from "../../support/api/requests/Attribute";
import { createCategory } from "../../support/api/requests/Category";
import {
  checkoutShippingAddressUpdate,
  checkoutVariantsUpdate,
  completeCheckout,
  createCheckout
} from "../../support/api/requests/Checkout";
import { getOrder } from "../../support/api/requests/Order";
import { createTypeProduct } from "../../support/api/requests/ProductType";
import { getDefaultChannel } from "../../support/api/utils/channelsUtils";
import {
  addPayment,
  createAndCompleteCheckoutWithoutShipping,
  createWaitingForCaptureOrder,
  getShippingMethodIdFromCheckout,
  updateShippingInCheckout
} from "../../support/api/utils/ordersUtils";
import {
  addDigitalContentAndUpdateProductType,
  createProductInChannel
} from "../../support/api/utils/products/productsUtils";
import { createShipping } from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all", "critical", "refactored"] }, () => {
  describe("Purchase products with all products types", () => {
    const startsWith = `CyPurchaseByType`;
    const name = `${startsWith}${faker.datatype.number()}`;
    const email = `${startsWith}@example.com`;
    const testsMessage = "Check order status";
    const digitalName = `${startsWith}${faker.datatype.number()}`;
    const physicalName = `${startsWith}${faker.datatype.number()}`;
    const { softExpect } = chai;

    let defaultChannel;
    let address;
    let warehouse;
    let attribute;
    let category;
    let shippingMethod;
    let createProductData;
    let digitalVariants;
    let physicalVariants;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
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
          ({
            warehouse: warehouseResp,
            shippingMethod: shippingMethodResp
          }) => {
            warehouse = warehouseResp;
            shippingMethod = shippingMethodResp;
          }
        );
      createAttribute({ name })
        .then(attributeResp => {
          attribute = attributeResp;
          createCategory({ name });
        })
        .then(categoryResp => {
          category = categoryResp;
          createProductData = {
            name: digitalName,
            channelId: defaultChannel.id,
            warehouseId: warehouse.id,
            quantityInWarehouse: 10,
            attributeId: attribute.id,
            categoryId: category.id,
            price: 10
          };
          createTypeProduct({
            name: digitalName,
            attributeId: attribute.id,
            shippable: false
          });
        })
        .then(productType => {
          createProductData.productTypeId = productType.id;
          createProductInChannel(createProductData);
        })
        .then(({ variantsList }) => {
          digitalVariants = variantsList;
          addDigitalContentAndUpdateProductType(
            digitalVariants[0].id,
            createProductData.productTypeId,
            defaultChannel.id
          );
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
          physicalVariants = variantsList;
        });
    });

    it("should purchase digital product", () => {
      createAndCompleteCheckoutWithoutShipping({
        channelSlug: defaultChannel.slug,
        email,
        billingAddress: address,
        variantsList: digitalVariants,
        auth: "token"
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
      createWaitingForCaptureOrder({
        channelSlug: defaultChannel.slug,
        email,
        variantsList: physicalVariants,
        shippingMethodName: shippingMethod.name,
        address
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
      let checkout;

      createCheckout({
        channelSlug: defaultChannel.slug,
        email,
        variantsList: digitalVariants,
        billingAddress: address,
        auth: "token"
      })
        .then(({ checkout: checkoutResp }) => {
          checkout = checkoutResp;
          addPayment(checkout.id);
        })
        .then(() => {
          checkoutVariantsUpdate(checkout.id, physicalVariants);
        })
        .then(() => {
          const shippingMethodId = getShippingMethodIdFromCheckout(
            checkout,
            shippingMethod.name
          );
          expect(
            shippingMethodId,
            "Should be not possible to add shipping method without shipping address"
          ).to.not.be.ok;
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
          updateShippingInCheckout(checkout.token, shippingMethod.name);
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
});
