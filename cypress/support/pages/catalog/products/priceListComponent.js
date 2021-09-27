import { PRICE_LIST } from "../../../../elements/catalog/products/price-list";

export const priceInputLists = {
  sellingPrice: PRICE_LIST.priceInput,
  costPrice: PRICE_LIST.costPriceInput
};

export function fillUpPriceList(
  price = 1,
  priceTypeInput = priceInputLists.sellingPrice
) {
  cy.get(priceTypeInput).each($priceInput => {
    cy.wrap($priceInput).type(price);
  });
}
