import Utils from "./utils/Utils";

class Sales {
  getSales(first, searchQuery) {
    const filter = new Utils().getValueWithDefault(
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
  deleteSale(saleId) {
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
}
export default Sales;
