/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import {
  BUTTON_SELECTORS,
  ORDER_GRANT_REFUND,
  ORDERS_SELECTORS,
  SHARED_ELEMENTS,
} from "../../elements/";
import { MESSAGES, ONE_PERMISSION_USERS, urlList } from "../../fixtures";
import {
  createCustomer,
  getOrder,
  updateMetadata,
  updateOrdersSettings,
  updatePrivateMetadata,
} from "../../support/api/requests/";
import {
  createFulfilledOrder,
  createOrder,
  createReadyToFulfillOrder,
  createShipping,
  createUnconfirmedOrder,
  getDefaultChannel,
  getDefaultTaxClass,
  productsUtils,
  updateTaxConfigurationForChannel,
} from "../../support/api/utils/";
import { ensureCanvasStatic } from "../../support/customCommands/sharedElementsOperations/canvas";
import {
  addNewProductToOrder,
  addPrivateMetadataFieldFulfillmentOrder,
  addPublicMetadataFieldFulfillmentOrder,
  applyFixedLineDiscountForProduct,
  changeQuantityOfProducts,
  deletePrivateFulfillmentMetadata,
  deleteProductFromGridTableOnIndex,
  deletePublicFulfillmentMetadata,
  expandPrivateFulfillmentMetadata,
  expandPublicFulfillmentMetadata,
  openVariantDetailsOptions,
  updatePrivateMetadataFieldFulfillmentOrder,
  updatePublicMetadataFieldFulfillmentOrder,
} from "../../support/pages/";

describe("Orders", () => {
  const startsWith = "Orders-Cy-";
  const randomName = startsWith + faker.datatype.number();

  let customer;
  let defaultChannel;
  let warehouse;
  let shippingMethod;
  let variantsList;
  let address;
  let taxClass;
  let productDetails;

  const shippingPrice = 2;
  const variantPrice = 1;
  const metadataName = randomName + "- metadata name";
  const metadataValue = randomName + "- metadata value";
  const privateMetadataName = randomName + "- private metadata name";
  const privateMetadataValue = randomName + "- private metadata value";
  const updatedMetadataName = metadataName + "- updated metadata name";
  const updatedMetadataValue = metadataValue + "- updated metadata value";
  const updatedPrivateMetadataName =
    privateMetadataName + "- updated private metadata name";
  const updatedPrivateMetadataValue =
    privateMetadataValue + "- updated private metadata value";

  before(() => {
    cy.loginUserViaRequest();
    updateOrdersSettings();
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        updateTaxConfigurationForChannel({ channelSlug: defaultChannel.slug });
        getDefaultTaxClass();
      })
      .then(resp => {
        taxClass = resp;
        cy.fixture("addresses");
      })
      .then(addresses => {
        address = addresses.plAddress;
        createCustomer(`${randomName}@example.com`, randomName, address, true);
      })
      .then(customerResp => {
        customer = customerResp.user;
        createShipping({
          channelId: defaultChannel.id,
          name: randomName,
          price: shippingPrice,
          address,
          taxClassId: taxClass.id,
        });
      })
      .then(
        ({ warehouse: warehouseResp, shippingMethod: shippingMethodResp }) => {
          shippingMethod = shippingMethodResp;
          warehouse = warehouseResp;
          productsUtils.createTypeAttributeAndCategoryForProduct({
            name: randomName,
          });
        },
      )
      .then(
        ({
          productType: productTypeResp,
          attribute: attributeResp,
          category: categoryResp,
        }) => {
          productsUtils.createProductInChannel({
            name: randomName,
            channelId: defaultChannel.id,
            price: variantPrice,
            warehouseId: warehouse.id,
            productTypeId: productTypeResp.id,
            attributeId: attributeResp.id,
            categoryId: categoryResp.id,
            taxClassId: taxClass.id,
          });
        },
      )
      .then(({ variantsList: variantsResp, product }) => {
        productDetails = product;
        variantsList = variantsResp;
        cy.checkIfDataAreNotNull({
          customer,
          defaultChannel,
          warehouse,
          shippingMethod,
          variantsList,
          address,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest("auth", ONE_PERMISSION_USERS.order);
  });

  it(
    "should not be possible to change channel in order. TC: SALEOR_2105",
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      createOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(order => {
        cy.visit(urlList.orders + `${order.id}`);
        cy.get(ORDERS_SELECTORS.salesChannel)
          .find("[button]")
          .should("not.exist");
      });
    },
  );

  it(
    "should cancel fulfillment. TC: SALEOR_2106",
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      let order;
      createFulfilledOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
        warehouse: warehouse.id,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders + `${order.id}`);
          cy.get(SHARED_ELEMENTS.skeleton)
            .should("not.exist")
            .get(ORDERS_SELECTORS.cancelFulfillment)
            .click()
            .get(ORDERS_SELECTORS.cancelFulfillmentSelectField)
            .click()
            .get(BUTTON_SELECTORS.selectOption)
            .first()
            .click()
            .addAliasToGraphRequest("OrderFulfillmentCancel")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors("@OrderFulfillmentCancel");
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.status).to.be.eq("UNFULFILLED");
        });
    },
  );

  it(
    "should make a refund. TC: 2107",
    { tags: ["@orders", "@allEnv", "@stable", "@oldRelease"] },
    () => {
      let order;
      createReadyToFulfillOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders + `${order.id}`);
          cy.get(ORDERS_SELECTORS.refundButton)
            .click()
            .get(ORDER_GRANT_REFUND.productsQuantityInput)
            .type("1")
            .addAliasToGraphRequest("OrderFulfillmentRefundProducts");
          cy.get(BUTTON_SELECTORS.submit)
            .click()
            .waitForRequestAndCheckIfNoErrors(
              "@OrderFulfillmentRefundProducts",
            );
          getOrder(order.id);
        })
        .then(orderResp => {
          expect(orderResp.paymentStatus).to.be.eq("PARTIALLY_REFUNDED");
        });
    },
  );

  it(
    "should add line item discount (for single product in order) . TC: SALEOR_2125",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      const totalPrice = variantPrice + shippingPrice;
      const inlineDiscount = 0.5;
      const discountReason = "product damaged";
      createUnconfirmedOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(unconfirmedOrderResponse => {
        cy.visit(urlList.orders + `${unconfirmedOrderResponse.order.id}`);
        applyFixedLineDiscountForProduct(inlineDiscount, discountReason);
        cy.get(ORDERS_SELECTORS.priceCellFirstRowOrderDetails).should(
          "have.text",
          inlineDiscount,
        );
        cy.get(ORDERS_SELECTORS.orderSummarySubtotalPriceRow).should(
          "contain.text",
          variantPrice - inlineDiscount,
        );
        cy.get(ORDERS_SELECTORS.orderSummaryTotalPriceRow).should(
          "contain.text",
          totalPrice - inlineDiscount,
        );
      });
    },
  );

  it(
    "should remove product from unconfirmed order . TC: SALEOR_2126",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createUnconfirmedOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(unconfirmedOrderResponse => {
        cy.visit(urlList.orders + `${unconfirmedOrderResponse.order.id}`);
        deleteProductFromGridTableOnIndex(1);
        cy.contains(MESSAGES.noProductFound).should("be.visible");
        cy.get(ORDERS_SELECTORS.productDeleteFromRowButton).should("not.exist");
      });
    },
  );
  it(
    "should change quantity of products on order detail view . TC: SALEOR_2127",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createUnconfirmedOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(unconfirmedOrderResponse => {
        cy.visit(urlList.orders + `${unconfirmedOrderResponse.order.id}`);
        ensureCanvasStatic(SHARED_ELEMENTS.dataGridTable);
        changeQuantityOfProducts();

        cy.get(ORDERS_SELECTORS.orderSummarySubtotalPriceRow).should(
          "contain.text",
          variantPrice * 2,
        );
        cy.get(ORDERS_SELECTORS.orderSummaryTotalPriceRow).should(
          "contain.text",
          shippingPrice + variantPrice * 2,
        );
      });
    },
  );
  it(
    "should add new product on order detail view . TC: SALEOR_2128",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createUnconfirmedOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(unconfirmedOrderResponse => {
        cy.visit(urlList.orders + `${unconfirmedOrderResponse.order.id}`);
        cy.get(ORDERS_SELECTORS.dataGridTable).should("be.visible");
        addNewProductToOrder().then(productName => {
          cy.get(ORDERS_SELECTORS.productNameSecondRowOrderDetails).should(
            "contain.text",
            productName,
          );
        });
      });
    },
  );

  it(
    "should create metadata and private metadata for fulfilled order . TC: SALEOR_2129",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      let order;

      cy.addAliasToGraphRequest("UpdateMetadata");
      cy.addAliasToGraphRequest("UpdatePrivateMetadata");
      createFulfilledOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
        warehouse: warehouse.id,
      })
        .then(({ order: orderResp }) => {
          order = orderResp;
          cy.visit(urlList.orders + `${order.id}`);
          addPublicMetadataFieldFulfillmentOrder(
            0,
            metadataName,
            metadataValue,
          );
          addPrivateMetadataFieldFulfillmentOrder(
            0,
            privateMetadataName,
            privateMetadataValue,
          );
        })
        .then(() => {
          cy.clickConfirmButton()
            .waitForRequestAndCheckIfNoErrors("@UpdateMetadata")
            .waitForRequestAndCheckIfNoErrors("@UpdatePrivateMetadata");
          cy.confirmationMessageShouldAppear();
          getOrder(order.id).then(orderResponse => {
            // check to see updated fulfillment metadata and private meta data
            cy.wrap(orderResponse.fulfillments[0].metadata[0]).should(
              "deep.equal",
              {
                key: metadataName,
                value: metadataValue,
              },
            );
            cy.wrap(orderResponse.fulfillments[0].privateMetadata[0]).should(
              "deep.equal",
              {
                key: privateMetadataName,
                value: privateMetadataValue,
              },
            );
          });
        });
    },
  );
  it(
    "should update metadata and private metadata for fulfilled order .  TC: SALEOR_2130",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("UpdateMetadata");
      cy.addAliasToGraphRequest("UpdatePrivateMetadata");
      createFulfilledOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
        warehouse: warehouse.id,
      }).then(orderResp => {
        getOrder(orderResp.order.id).then(orderDetails => {
          updateMetadata(
            orderDetails.fulfillments[0].id,
            metadataName,
            metadataValue,
          ).then(() => {
            updatePrivateMetadata(
              orderDetails.fulfillments[0].id,
              privateMetadataName,
              privateMetadataValue,
            )
              .then(() => {
                cy.visit(urlList.orders + `${orderResp.order.id}`);
                updatePublicMetadataFieldFulfillmentOrder(
                  0,
                  updatedMetadataName,
                  updatedMetadataValue,
                );
                updatePrivateMetadataFieldFulfillmentOrder(
                  0,
                  updatedPrivateMetadataName,
                  updatedPrivateMetadataValue,
                );
              })
              .then(() => {
                cy.clickConfirmButton()
                  .waitForRequestAndCheckIfNoErrors("@UpdateMetadata")
                  .waitForRequestAndCheckIfNoErrors("@UpdatePrivateMetadata");
                cy.confirmationMessageShouldAppear();
                getOrder(orderResp.order.id).then(orderResponse => {
                  // check to see updated fulfillment metadata and private meta data
                  cy.wrap(orderResponse.fulfillments[0].metadata[0]).should(
                    "deep.equal",
                    {
                      key: updatedMetadataName,
                      value: updatedMetadataValue,
                    },
                  );
                  cy.wrap(
                    orderResponse.fulfillments[0].privateMetadata[0],
                  ).should("deep.equal", {
                    key: updatedPrivateMetadataName,
                    value: updatedPrivateMetadataValue,
                  });
                });
              });
          });
        });
      });
    },
  );
  it(
    "should delete metadata and private metadata for fulfilled order .  TC: SALEOR_2131",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      cy.addAliasToGraphRequest("UpdateMetadata");
      cy.addAliasToGraphRequest("UpdatePrivateMetadata");
      createFulfilledOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
        warehouse: warehouse.id,
      }).then(orderResp => {
        getOrder(orderResp.order.id).then(orderDetails => {
          updateMetadata(
            orderDetails.fulfillments[0].id,
            metadataName,
            metadataValue,
          ).then(() => {
            updatePrivateMetadata(
              orderDetails.fulfillments[0].id,
              privateMetadataName,
              privateMetadataValue,
            )
              .then(() => {
                cy.visit(urlList.orders + `${orderResp.order.id}`);
                expandPublicFulfillmentMetadata(0);
                deletePublicFulfillmentMetadata(0, 0);
                expandPrivateFulfillmentMetadata(0);
                deletePrivateFulfillmentMetadata(0, 0);
              })
              .then(() => {
                cy.clickConfirmButton()
                  .waitForRequestAndCheckIfNoErrors("@UpdateMetadata")
                  .waitForRequestAndCheckIfNoErrors("@UpdatePrivateMetadata");
                cy.confirmationMessageShouldAppear();
                cy.contains(privateMetadataName).should("not.exist");
                cy.contains(metadataName).should("not.exist");
                getOrder(orderResp.order.id).then(orderResponse => {
                  // check to see updated fulfillment metadata and private meta data
                  cy.wrap(orderResponse.fulfillments[0].metadata).should(
                    "deep.equal",
                    [],
                  );
                  cy.wrap(orderResponse.fulfillments[0].privateMetadata).should(
                    "deep.equal",
                    [],
                  );
                });
              });
          });
        });
      });
    },
  );
  it(
    "should open product details from order details - unconfirmed order. TC: SALEOR_2133",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      createUnconfirmedOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(unconfirmedOrderResponse => {
        cy.visit(urlList.orders + `${unconfirmedOrderResponse.order.id}`);
        openVariantDetailsOptions();
        cy.get(ORDERS_SELECTORS.openProductDetailsButton).then(
          openProductInNewTabButton => {
            cy.wrap(openProductInNewTabButton)
              .invoke("attr", "target")
              .should("eq", "_blank");
            cy.wrap(openProductInNewTabButton)
              .invoke("attr", "href")
              .should("contain", productDetails.id.replace("=", ""));
          },
        );
      });
    },
  );
  it(
    "should open product details from order details - confirmed order. TC: 2134",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      let order;
      createReadyToFulfillOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(({ order: orderResp }) => {
        order = orderResp;
        cy.visit(urlList.orders + `${order.id}`);
        cy.get(ORDERS_SELECTORS.rowActionButton)
          .find("a")
          .then(openProductInNewTabButton => {
            cy.wrap(openProductInNewTabButton)
              .invoke("attr", "target")
              .should("eq", "_blank");
            cy.wrap(openProductInNewTabButton)
              .invoke("attr", "href")
              .should("contain", productDetails.id.replace("=", ""));
          });
      });
    },
  );
  it(
    "should be able to turn off all but one static columns on orders detail. TC: SALEOR_2136",
    { tags: ["@orders", "@allEnv", "@stable"] },
    () => {
      let order;
      createReadyToFulfillOrder({
        customerId: customer.id,
        channelId: defaultChannel.id,
        shippingMethod,
        variantsList,
        address,
      }).then(({ order: orderResp }) => {
        order = orderResp;
        cy.visit(urlList.orders + `${order.id}`);
        cy.openColumnPicker();
        cy.get(SHARED_ELEMENTS.staticColumnContainer)
          .should("contain.text", "Product")
          .should("contain.text", "SKU")
          .should("contain.text", "Variant")
          .should("contain.text", "Quantity")
          .should("contain.text", "Price")
          .should("contain.text", "Total")
          .should("contain.text", "Is gift")
          .should("contain.text", "Metadata");
        // switching off all but one static columns
        cy.get(SHARED_ELEMENTS.gridStaticSkuButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticVariantNameButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticQuantityButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticPriceButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticTotalButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticIsGiftButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticMetadataButton).click();
        cy.get(SHARED_ELEMENTS.gridStaticProductButton).should(
          "have.attr",
          "data-state",
          "on",
        );
        cy.get(SHARED_ELEMENTS.dataGridTable)
          .find("th")
          .should("have.length", 1)
          .should("have.text", "Product");
        // next line hides picker
        cy.get(SHARED_ELEMENTS.pageHeader).click({ force: true });
        cy.get(SHARED_ELEMENTS.dynamicColumnContainer).should("not.exist");
      });
    },
  );
});
