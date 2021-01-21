Cypress.Commands.add("createShippingRate", (name, shippingZone) => {
  const mutation = `
    mutation{
        CreateShippingRate(input:{
            maximumDeliveryDays: null
            minimumDeliveryDays: null
            name: "${name}"
            shippingZone: "${shippingZone}"
            type: "PRICE"
        })
    }
    `;
  return mutation;
});

Cypress.Commands.add("createShippingZone", (name, country) => {
  const mutation = `
    mutation{
        shippingZoneCreate(input:{
          name: "${name}"
          countries: "${country}"
        }){
          shippingZone{
            id
          }
        }
      }
    `;
  return mutation;
});

Cypress.Commands.add("", (shippingRateId, channelId) => {
  const mutation = `
    mutation{
        shippingMethodChannelListingUpdate(id:"${shippingRateId}", input:{
          addChannels: {
            channelId:"${channelId}"
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
      }
    `;
  return mutation;
});
