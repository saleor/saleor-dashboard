/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { createAttribute } from "../../support/api/requests/Attribute";
import { createCategory } from "../../support/api/requests/Category";
import {
  checkoutShippingAddressUpdate,
  checkoutShippingMethodUpdate,
  checkoutVariantsUpdate,
  completeCheckout,
  createCheckout
} from "../../support/api/requests/Checkout";
import { getOrder } from "../../support/api/requests/Order";
import {
  createDigitalContent,
  createTypeProduct
} from "../../support/api/requests/ProductType";
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
  createProductInChannel,
  deleteProductsStartsWith
} from "../../support/api/utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../support/api/utils/shippingUtils";
import filterTests from "../../support/filterTests";

filterTests({ definedTags: ["all", "critical"] }, () => {
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

    xit("should purchase digital product", () => {
      const digitalName = `${startsWith}${faker.datatype.number()}`;
      let variants;

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
          variants = variantsList;
          addDigitalContentAndUpdateProductType(
            variants[0].id,
            createProductData.productTypeId,
            defaultChannel.id
          );
        })
        .then(() => {
          createAndCompleteCheckoutWithoutShipping({
            channelSlug: defaultChannel.slug,
            email,
            billingAddress: address,
            variantsList: variants,
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

    xit("should purchase physical product", () => {
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
            shippingMethodName: shippingMethod.name,
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
          createDigitalContent(variantsList[0].id);
        })
        .then(() => {
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
