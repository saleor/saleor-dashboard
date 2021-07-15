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
  return cy.sendRequestWithQuery(mutation).its("body.data.shopSettingsUpdate");
}
