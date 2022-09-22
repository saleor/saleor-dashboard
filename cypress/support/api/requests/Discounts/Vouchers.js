import { getValueWithDefault } from "../utils/Utils";

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
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createVoucher(
  { name, productId, code = name, type, country },
  token,
) {
  const discountTypeLines = getValueWithDefault(type, `type:${type}`);
  const countryLine = getValueWithDefault(country, `countries:["${country}"]`);

  const mutation = `mutation{
    voucherCreate(input:{
      ${discountTypeLines}
      ${countryLine}
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
  return cy.sendRequestWithQuery(mutation, token).its("body.data");
}

export function addChannelToVoucher(voucherId, channelId, value) {
  const mutation = `mutation{
    voucherChannelListingUpdate(id:"${voucherId}" input:{
      addChannels:{
        channelId:"${channelId}"
        discountValue:"${value}"
      }
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
  return cy.sendRequestWithQuery(mutation).its("body.data");
}
