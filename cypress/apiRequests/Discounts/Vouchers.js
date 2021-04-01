export function getVouchers(first, startsWith) {
  const query = `query getVouchers{
    vouchers(first:${first}, filter:{
      search:"${startsWith}"
    }){
      edges{
        node{
          id
          code
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.vouchers.edges);
}
export function deleteVouchers(voucherId) {
  const mutation = `mutation deleteVouchers{
    voucherDelete(id:"${voucherId}"){
      discountErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
