
export function getTaxConfigurationList() {
  const query = `query{
    taxConfigurations(first:100){
      edges{
        node{
          id
          channel{
            id
            slug
          }
        }
      }
    }
  }
  `;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.taxConfigurations.edges);
}

export function updateTaxes({ id, chargeTaxes = true, taxCalculationStrategy = "FLAT_RATES" }) {
  const mutation = `mutation{
    taxConfigurationUpdate(id:"${id}", input:{
      chargeTaxes:${chargeTaxes}
      displayGrossPrices:true
      pricesEnteredWithTax:false
      removeCountriesConfiguration: []
      taxCalculationStrategy:${taxCalculationStrategy}
      updateCountriesConfiguration: []
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
}