import { getValueWithDefault } from "../utils/Utils";

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
      discountErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
