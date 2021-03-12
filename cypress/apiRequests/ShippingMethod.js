export function createShippingRate(name, shippingZone) {
  const mutation = `mutation{
    shippingPriceCreate(input:{
      name: "${name}"
      shippingZone: "${shippingZone}"
      type: PRICE
    }){
      shippingMethod{
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createShippingZone(name, country) {
  const mutation = `mutation{
    shippingZoneCreate(input:{
      name: "${name}"
      countries: "${country}"
    }){
      shippingZone{
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addChannelToShippingMethod(shippingRateId, channelId, price) {
  const mutation = `mutation{
    shippingMethodChannelListingUpdate(id:"${shippingRateId}", input:{
      addChannels: {
        channelId:"${channelId}"
        price: ${price}
      }
    }){
      shippingMethod{
        id
      }
      shippingErrors{
        code
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function deleteShippingZone(shippingZoneId) {
  const mutation = `mutation{
          shippingZoneDelete(id:"${shippingZoneId}"){
            shippingErrors{
              message
            }
          }
        }
        `;
  return cy.sendRequestWithQuery(mutation);
}

export function getShippingZones() {
  const query = `query{
          shippingZones(first:100){
            edges{
              node{
                name
                id
              }
            }
          }
        }
        `;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.shippingZones.edges);
}
