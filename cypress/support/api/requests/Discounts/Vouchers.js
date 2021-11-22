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

export function createVoucher({ name, productId, code = name }) {
  const mutation = `mutation{
    voucherCreate(input:{
      name:"${name}",
      code:"${code}"
      products:["${productId}"]
    }){
      voucher{
        id
        code
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.voucherCreate");
}

export function addChannelToVoucher(voucherId, channelId, value) {
  const mutation = `mutation{
    voucherChannelListingUpdate(id:"${voucherId}" input:{
      addChannels:{
        channelId:"${channelId}"
        discountValue:"${value}"
      }
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
