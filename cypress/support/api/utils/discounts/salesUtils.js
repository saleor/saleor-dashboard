import {
  addChannelToSale,
  createSale,
  deleteSale,
  getSales,
  updateSale
} from "../../requests/Discounts/Sales";

export function deleteSalesStartsWith(startsWith) {
  cy.deleteElementsStartsWith(deleteSale, getSales, startsWith);
}

export function createSaleInChannel({
  name,
  type,
  value,
  channelId,
  discountValue = value
}) {
  let sale;
  return createSale({
    name,
    type,
    value
  })
    .then(saleResp => {
      sale = saleResp;
      addChannelToSale(sale.id, channelId, discountValue);
    })
    .then(() => sale);
}

export function createSaleInChannelWithProduct({
  name,
  type,
  value,
  channelId,
  variants,
  productId
}) {
  let sale;
  return createSaleInChannel({
    name,
    type,
    value,
    channelId
  })
    .then(saleResp => {
      sale = saleResp;
      updateSale({
        saleId: sale.id,
        variants,
        productId
      });
    })
    .then(() => sale);
}
