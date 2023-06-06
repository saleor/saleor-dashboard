/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { PRODUCT_DETAILS } from "../../../elements/catalog/products/product-details";
import { PRODUCTS_LIST } from "../../../elements/catalog/products/products-list";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { urlList } from "../../../fixtures/urlList";
import { ONE_PERMISSION_USERS } from "../../../fixtures/users";
import { updateVariantWarehouse } from "../../../support/api/requests/Product";
import { createTypeProduct } from "../../../support/api/requests/ProductType";
import { createWaitingForCaptureOrder } from "../../../support/api/utils/ordersUtils";
import * as productUtils from "../../../support/api/utils/products/productsUtils";
import * as shippingUtils from "../../../support/api/utils/shippingUtils";
import { getProductVariants } from "../../../support/api/utils/storeFront/storeFrontProductUtils";
import { updateTaxConfigurationForChannel } from "../../../support/api/utils/taxesUtils";
import {
  fillUpPriceList,
  priceInputLists,
} from "../../../support/pages/catalog/products/priceListComponent";
import {
  enterVariantEditPage,
  fillUpProductTypeDialog,
} from "../../../support/pages/catalog/products/productDetailsPage";
import {
  createVariant,
  selectChannelsForVariant,
} from "../../../support/pages/catalog/products/VariantsPage";
import { selectChannelInDetailsPages } from "../../../support/pages/channelsPage";

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
    cy.clearSessionData().loginUserViaRequest();
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

    productUtils
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
          createTypeProduct({
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
    cy.clearSessionData().loginUserViaRequest(
      "auth",
      ONE_PERMISSION_USERS.product,
    );
  });

  it(
    "should create variant without sku TC: SALEOR_2807",
    { tags: ["@products", "@allEnv"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const variants = [{ price: 7 }, { name: attributeValues[1], price: 16 }];
      let createdProduct;

      productUtils
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
          enterVariantEditPage();
          cy.get(PRODUCT_DETAILS.addVariantButton)
            .click()
            .then(() => {
              createVariant({
                attributeName: variants[1].name,
                price: variants[1].price,
                channelName: defaultChannel.name,
                warehouseId: warehouse.id,
                variantName: name,
              });
            });
        })
        .then(() => {
          getProductVariants(createdProduct.id, defaultChannel.slug);
        })
        .then(([firstVariant, secondVariant]) => {
          expect(secondVariant).to.have.property("price", variants[0].price);
          expect(firstVariant).to.have.property("name", name);
          expect(firstVariant).to.have.property("price", variants[1].price);
          createWaitingForCaptureOrder({
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

      cy.visit(urlList.products).get(PRODUCTS_LIST.createProductBtn).click();
      fillUpProductTypeDialog({ productType: simpleProductType.name });
      cy.get(BUTTON_SELECTORS.submit)
        .click()
        .get(PRODUCT_DETAILS.productNameInput)
        .type(name)
        .fillAutocompleteSelect(PRODUCT_DETAILS.categoryInput);
      selectChannelInDetailsPages(defaultChannel.name);
      fillUpPriceList(prices.sellingPrice);
      fillUpPriceList(prices.costPrice, priceInputLists.costPrice);
      cy.addAliasToGraphRequest("VariantCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@VariantCreate")
        .then(({ response }) => {
          const variantId =
            response.body.data.productVariantCreate.productVariant.id;
          updateVariantWarehouse({
            variantId,
            warehouseId: warehouse.id,
            quantity: 10,
          });
        });
      enterVariantEditPage();
      cy.addAliasToGraphRequest("VariantUpdate");
      selectChannelsForVariant();
      cy.get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .wait("@VariantUpdate")
        .then(({ response }) => {
          const variants = [
            response.body.data.productVariantUpdate.productVariant,
          ];
          createWaitingForCaptureOrder({
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
