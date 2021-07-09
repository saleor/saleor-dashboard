import faker from "faker";

import { createCollection } from "../../../../apiRequests/Collections";
import { updateProduct } from "../../../../apiRequests/Product";
import { PRODUCTS_LIST } from "../../../../elements/catalog/products/products-list";
import { SHARED_ELEMENTS } from "../../../../elements/shared/sharedElements";
import {
  checkFilterOption,
  selectChannel,
  selectFilterBy,
  selectFilterOption,
  selectProductsOutOfStock
} from "../../../../steps/catalog/products/productsListSteps";
import { selectChannelInHeader } from "../../../../steps/channelsSteps";
import { urlList } from "../../../../url/urlList";
import { getDefaultChannel } from "../../../../utils/channelsUtils";
import {
  createProductInChannel,
  createTypeAttributeAndCategoryForProduct,
  deleteProductsStartsWith
} from "../../../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../../../utils/shippingUtils";

describe("Filtering products", () => {
  const startsWith = "CyFilterProducts-";
  const name = `${startsWith}${faker.datatype.number()}`;
  const stockQuantity = 747;
  const price = 342;
  let attribute;
  let productType;
  let category;
  let warehouse;
  let channel;
  let collection;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteShippingStartsWith(startsWith);
    deleteProductsStartsWith(startsWith);
    createTypeAttributeAndCategoryForProduct(name).then(
      ({
        attribute: attributeResp,
        productType: productTypeResp,
        category: categoryResp
      }) => {
        attribute = attributeResp;
        productType = productTypeResp;
        category = categoryResp;
      }
    );
    createCollection(name).then(
      collectionResp => (collection = collectionResp)
    );
    getDefaultChannel()
      .then(channelResp => {
        channel = channelResp;
        cy.fixture("addresses");
      })
      .then(addresses => {
        createShipping({
          channelId: channel.id,
          name,
          address: addresses.plAddress
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        createProductInChannel({
          name,
          channelId: channel.id,
          warehouseId: warehouse.id,
          quantityInWarehouse: stockQuantity,
          price,
          attributeId: attribute.id,
          categoryId: category.id,
          productTypeId: productType.id
        });
      })
      .then(({ product: product }) => {
        updateProduct(product.id, { collections: [collection.id] });
      });
  });
  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.products);
  });
  const filterProductsBy = ["category", "collection", "productType"];
  filterProductsBy.forEach(filterBy => {
    it(`should filter products by ${filterBy}`, () => {
      cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
      selectFilterOption(filterBy, name);
      cy.getTextFromElement(PRODUCTS_LIST.productsNames).then(product => {
        expect(product).to.includes(name);
      });
    });
  });

  it("should filter products out of stock", () => {
    const productOutOfStock = `${startsWith}${faker.datatype.number()}`;
    createProductInChannel({
      name: productOutOfStock,
      channelId: channel.id,
      warehouseId: warehouse.id,
      quantityInWarehouse: 0,
      productTypeId: productType.id,
      attributeId: attribute.id,
      categoryId: category.id,
      price
    });
    cy.get(SHARED_ELEMENTS.progressBar).should("not.exist");
    selectChannel(channel.slug);
    selectProductsOutOfStock();
    cy.getTextFromElement(PRODUCTS_LIST.productsNames).then(product => {
      expect(product).to.includes(productOutOfStock);
    });
  });
});
