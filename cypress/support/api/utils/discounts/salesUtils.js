import { getVariant } from "../../../../support/api/requests/Product";
import {
  addChannelToSale,
  createSale,
  deleteSale,
  getSales,
  updateSale,
} from "../../requests/Discounts/Sales";

export function deleteSalesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteSale, getSales, startsWith);
}

export function createSaleInChannel({
  name,
  type,
  value,
  channelId,
  discountValue = value,
}) {
  let sale;
  return createSale({
    name,
    type,
    value,
  })
    .then(saleResp => {
      sale = saleResp;
      addChannelToSale(sale.id, channelId, discountValue);
    })
    .then(() => sale);
}
export function shouldVariantBeOnSale(
  variantId,
  channelSlug,
  shouldBeSales,
  retries = 0,
) {
  return getVariant(variantId, channelSlug).then(salesResponse => {
    if (salesResponse.pricing.onSale === shouldBeSales) {
      return;
    } else if (retries > 4) {
      throw new Error(
        `Variant field onSale should have value: ${shouldBeSales} but has opposite. Retried for ${retries} times`,
      );
    } else {
      cy.wait(5000);
      shouldVariantBeOnSale(variantId, channelSlug, shouldBeSales, retries + 1);
    }
  });
}

export function createSaleInChannelWithProduct({
  name,
  type,
  value,
  channelId,
  variants,
  productId,
}) {
  let sale;
  return createSaleInChannel({
    name,
    type,
    value,
    channelId,
  })
    .then(saleResp => {
      sale = saleResp;
      updateSale({
        saleId: sale.id,
        variants,
        productId,
      });
    })
    .then(() => sale);
}
