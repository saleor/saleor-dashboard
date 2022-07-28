import {
  getValuesInArray,
  getValueWithDefault,
  getVariantsIdsLines
} from "../utils/Utils";

export function getSales(first, searchQuery) {
  const filter = getValueWithDefault(
    searchQuery,
    `, filter:{
        search:"${searchQuery}"
      }`
  );
  const query = `query{
    sales(first:
    ${first} ${filter}){
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.sales.edges);
}
export function deleteSale(saleId) {
  const mutation = `mutation{
    saleDelete(id:"${saleId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createSale({ name, type, value, products, variants }) {
  const productsLine = getValueWithDefault(products, `products: ${products}`);
  const variantsLine = getValueWithDefault(variants, `variants: ${variants}`);
  const mutation = `mutation{
    saleCreate(input:{
      name: "${name}"
      type: ${type}
      value: ${value}
      ${productsLine}
      ${variantsLine}
    }){
      sale{
        id
        name
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.saleCreate.sale");
}

export function updateSale({ saleId, variants, productId }) {
  const productsLine = getValueWithDefault(
    productId,
    `products: [${productId}]`
  );
  const variantsLines = getValueWithDefault(
    variants,
    getValuesInArray(getVariantsIdsLines(variants)),
    "[]"
  );
  const mutation = `mutation{
    saleUpdate(id:"${saleId}" input:{
      ${productsLine}
      variants: ${variantsLines}
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addChannelToSale(saleId, channelId, discountValue) {
  const mutation = `mutation{
    saleChannelListingUpdate(id:"${saleId}" input:{
      addChannels: [{
        channelId: "${channelId}"
        discountValue: "${discountValue}"
      }]
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
