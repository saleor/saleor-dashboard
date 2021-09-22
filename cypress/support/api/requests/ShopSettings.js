import { getDefaultAddress } from "./utils/Utils";

export function updateShopWeightUnit(weightUnit) {
  const mutation = `mutation{
    shopSettingsUpdate(input:{
      defaultWeightUnit: ${weightUnit}
    }){
      errors{
        field
        message
      }
      shop{
        defaultWeightUnit
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .wait(5000)
    .its("body.data.shopSettingsUpdate");
}

export function updateShopAddress(address) {
  const input = getDefaultAddress(address, "input");
  const mutation = `mutation{
    shopAddressUpdate(${input}){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getShopInfo() {
  const query = `query{
    shop{
      name
      version
      domain{
        host
      }
      description
      companyAddress{
        companyName
        streetAddress1
        streetAddress2
        city
        cityArea
        postalCode
        country{
          code
        }
        countryArea
        phone
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.shop");
}
