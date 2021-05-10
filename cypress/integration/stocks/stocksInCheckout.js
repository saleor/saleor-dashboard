import { createWaitingForCaptureOrder } from "../../utils/ordersUtils";
import { createProductInChannel } from "../../utils/products/productsUtils";
import {
  createShipping,
  deleteShippingStartsWith
} from "../../utils/shippingUtils";

describe("Products stocks in checkout", () => {
  const startsWith = "CyStocksCheckout-";
  const name = `${startsWith}${faker.random.number()}`;

  let defaultChannel;
  let product;
  let address;
  let warehouse;
  let attribute;
  let category;
  let productType;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteProductsStartsWith(startsWith);
    deleteShippingStartsWith(startsWith);
    cy.fixture("addresses")
      .then(addresses => {
        address = addresses.usAddress;
        getDefaultChannel();
      })
      .then(channel => {
        defaultChannel = channel;
        createShipping({
          channelId: defaultChannel.id,
          name,
          address
        });
      })
      .then(({ warehouse: warehouseResp }) => {
        warehouse = warehouseResp;
        createTypeAttributeAndCategoryForProduct(name);
      })
      .then(
        ({
          attribute: attributeResp,
          category: categoryResp,
          productType: productTypeResp
        }) => {
          attribute = attributeResp;
          category = categoryResp;
          productType = productTypeResp;
        }
      );
  });
  it("should create checkout with last product in stock", () => {
    createProductInChannel({
      attributeId: attribute.id,
      categoryId: category.id,
      productTypeId: productType.id,
      channelId: defaultChannel.id,
      name,
      warehouseId: warehouse.id,
      quantityInWarehouse: 1
    }).then(({ variantsList }) => {
      createWaitingForCaptureOrder(
        defaultChannel.slug,
        "email@example.com",
        variantsList
      );
    });
  });
});
