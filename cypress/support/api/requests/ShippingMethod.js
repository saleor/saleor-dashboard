import { getValueWithDefault } from "./utils/Utils";

export function createShippingRate({
  name,
  shippingZone,
  type = "PRICE",
  maxWeight,
  minWeight,
}) {
  const maxOrderWeight = getValueWithDefault(
    maxWeight,
    `maximumOrderWeight: ${maxWeight}`,
  );
  const minOrderWeight = getValueWithDefault(
    minWeight,
    `minimumOrderWeight: ${minWeight}`,
  );

  const mutation = `mutation{
    shippingPriceCreate(input:{
      name: "${name}"
      shippingZone: "${shippingZone}"
      type: ${type}
      ${minOrderWeight}
      ${maxOrderWeight}
    }){
      shippingMethod{
        id
        name
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.shippingPriceCreate");
}

export function createShippingZone(name, country, channelId, warehouseId) {
  const channelsLines = getValueWithDefault(
    channelId,
    `addChannels:["${channelId}"]`,
  );
  const mutation = `mutation{
    shippingZoneCreate(input:{
      name: "${name}"
      countries: "${country}"
      ${channelsLines}
      addWarehouses: ["${warehouseId}"]
    }){
      shippingZone{
        id
        name
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.shippingZoneCreate.shippingZone");
}

export function createShippingZoneWithoutWarehouse(name, country, channelId) {
  const channelsLines = getValueWithDefault(
    channelId,
    `addChannels:["${channelId}"]`,
  );
  const mutation = `mutation{
    shippingZoneCreate(input:{
      name: "${name}"
      countries: "${country}"
      ${channelsLines}
    }){
      shippingZone{
        id
        name
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.shippingZoneCreate.shippingZone");
}

export function addChannelToShippingZone(shippingZoneId, channelId) {
  const mutation = `mutation addCh{
    shippingZoneUpdate(id:"${shippingZoneId}", input:{
      addChannels:["${channelId}"]
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addChannelToShippingMethod(
  shippingRateId,
  channelId,
  price,
  minProductPrice = 0,
) {
  const mutation = `mutation{
    shippingMethodChannelListingUpdate(id:"${shippingRateId}", input:{
      addChannels: {
        channelId:"${channelId}"
        price: ${price}
        minimumOrderPrice:${minProductPrice}
      }
    }){
      shippingMethod{
        id
      }
      errors{
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
            errors{
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

export function getShippingZone(shippingZoneId) {
  const query = `query{
    shippingZone(id:"${shippingZoneId}"){
      id
      name
      description
      warehouses{
        name
        id
      }
      countries{
        code
      }
      channels{
        name
        id
      }
      shippingMethods{
        id
        name
        minimumDeliveryDays
        maximumDeliveryDays
        minimumOrderWeight{
          value
        }
        maximumOrderWeight{
          value
        }
        channelListings{
          price{
            amount
          }
          minimumOrderPrice{
            amount
          }
          maximumOrderPrice{
            amount
          }
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.shippingZone);
}
