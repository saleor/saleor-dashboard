/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import {
  BUTTON_SELECTORS,
  PRODUCT_DETAILS,
  PRODUCTS_LIST,
} from "../../../elements/";
import {
  ONE_PERMISSION_USERS,
  urlList,
} from "../../../fixtures/";
import {
  productsRequests,
  productsTypeRequests,
} from "../../../support/api/requests/";
import {
  ordersUtils,
  productsUtils,
  shippingUtils,
  storeFrontProductsUtils,
  updateTaxConfigurationForChannel,
} from "../../../support/api/utils/";
import {
  channelsPage,
  priceListComponent,
  productDetailsPage,
  variantsPage,
} from "../../../support/pages";

describe("Creating variants", () => {
  const startsWith = "CreateProdSku";
  const attributeValues = ["value1", "value2"];

  let defaultChannel;
  let warehouse;
  let attribute;
  let productType;
  let simpleProductType;
  let category;
  let shippingMethod;
  let address;

  before(() => {
    cy.loginUserViaRequest();
    const name = `${startsWith}${faker.datatype.number()}`;
    const simpleProductTypeName = `${startsWith}${faker.datatype.number()}`;

    cy.fixture("addresses").then(fixtureAddresses => {
      address = fixtureAddresses.plAddress;
    });

    shippingUtils
      .createShippingWithDefaultChannelAndAddress(name)
      .then(resp => {
        category = resp.category;
        defaultChannel = resp.defaultChannel;
        warehouse = resp.warehouse;
        shippingMethod = resp.shippingMethod;

        updateTaxConfigurationForChannel({
          channelSlug: defaultChannel.slug,
          pricesEnteredWithTax: true,
        });
      });

    productsUtils
      .createTypeAttributeAndCategoryForProduct({ name, attributeValues })
      .then(
        ({
          attribute: attributeResp,
          productType: productTypeResp,
          category: categoryResp,
        }) => {
          attribute = attributeResp;
          productType = productTypeResp;
          category = categoryResp;
          productsTypeRequests.createTypeProduct({
            name: simpleProductTypeName,
            attributeId: attribute.id,
            hasVariants: false,
          });
        },
      )
      .then(type => {
        simpleProductType = type;
        cy.checkIfDataAreNotNull({
          defaultChannel,
          warehouse,
          attribute,
          productType,
          simpleProductType,
          category,
          shippingMethod,
          address,
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest("auth", ONE_PERMISSION_USERS.product);
  });

  it(
    "should create variant without sku TC: SALEOR_2807",
    { tags: ["@products", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const variants = [{ price: 7 }, { name: attributeValues[1], price: 16 }];
      let createdProduct;

      productsUtils
        .createProductInChannel({
          name,
          attributeId: attribute.id,
          channelId: defaultChannel.id,
          warehouseId: warehouse.id,
          productTypeId: productType.id,
          categoryId: category.id,
          price: variants[0].price,
        })
        .then(({ product: productResp }) => {
          createdProduct = productResp;
          cy.visit(`${urlList.products}${createdProduct.id}`);
          productDetailsPage.enterVariantEditPage();
          cy.get(PRODUCT_DETAILS.addVariantButton)
            .click()
            .then(() => {
              variantsPage.createVariant({
                attributeName: variants[1].name,
                price: variants[1].price,
                channelName: defaultChannel.name,
                warehouseId: warehouse.id,
                variantName: name,
              });
            });
        })
        .then(() => {
          storeFrontProductsUtils.getProductVariants(
            createdProduct.id,
            defaultChannel.slug,
          );
        })
        .then(([firstVariant, secondVariant]) => {
          expect(secondVariant).to.have.property("price", variants[0].price);
          expect(firstVariant).to.have.property("name", name);
          expect(firstVariant).to.have.property("price", variants[1].price);
          ordersUtils.createWaitingForCaptureOrder({
            channelSlug: defaultChannel.slug,
            email: "example@example.com",
            variantsList: [firstVariant],
            shippingMethodName: shippingMethod.name,
            address,
          });
        })
        .then(({ order }) => {
          expect(order.id).to.be.ok;
        });
    },
  );

  it(
    "should create simple product without sku SALEOR_2808",
    { tags: ["@products", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const prices = { sellingPrice: 10, costPrice: 6 };
      cy.addAliasToGraphRequest("VariantUpdate");
      cy.addAliasToGraphRequest("VariantCreate");

      cy.visit(urlList.products).get(PRODUCTS_LIST.createProductBtn).click();
      productDetailsPage.fillUpProductTypeDialog({
        productType: simpleProductType.name,
      });
      cy.get(BUTTON_SELECTORS.submit)
        .click()
        .get(PRODUCT_DETAILS.productNameInput)
        .type(name, { force: true })
        .fillAutocompleteSelect(PRODUCT_DETAILS.categoryInput);
      channelsPage.selectChannelInDetailsPages(defaultChannel.name);
      priceListComponent.fillUpPriceList(prices.sellingPrice);
      priceListComponent.fillUpPriceList(
        prices.costPrice,
        priceListComponent.priceInputLists.costPrice,
      );
      cy.get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@VariantCreate")
        .then(({ response }) => {
          const variantId =
            response.body.data.productVariantCreate.productVariant.id;
          productsRequests.updateVariantWarehouse({
            variantId,
            warehouseId: warehouse.id,
            quantity: 10,
          });
        });
      productDetailsPage.enterVariantEditPage();
      variantsPage.selectChannelsForVariant();
      cy.get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@VariantUpdate")
        .then(({ response }) => {
          const variants = [
            response.body.data.productVariantUpdate.productVariant,
          ];
          ordersUtils
            .createWaitingForCaptureOrder({
              channelSlug: defaultChannel.slug,
              email: "example@example.com",
              variantsList: variants,
              shippingMethodName: shippingMethod.name,
              address,
            })
            .its("order.id")
            .should("be.ok");
        });
    },
  );
});
