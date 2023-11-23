export function createChannel({
  isActive = true,
  name,
  slug = name,
  currencyCode = "PLN",
  defaultCountry = "PL",
}) {
  const createChannelMutation = `mutation{
    channelCreate(input: {
      isActive: ${isActive}
      name: "${name}"
      slug: "${slug}"
      currencyCode: "${currencyCode}"
      defaultCountry: ${defaultCountry}
    }){
      channel{
        id
        name
        slug
      }
      errors{
        code
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(createChannelMutation)
    .its("body.data.channelCreate.channel");
}

export function getChannels() {
  const getChannelsInfoQuery = `query{
    channels{
      name
      id
      isActive
      slug
      currencyCode
    }
  }`;
  return cy.sendRequestWithQuery(getChannelsInfoQuery);
}

export function deleteChannel(channelId, targetChannelId) {
  const deleteChannelMutation = `mutation{
    channelDelete(id: "${channelId}", input:{
      channelId: "${targetChannelId}"
    }){
      channel{
        name
      }
      errors{
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(deleteChannelMutation);
}

export function activateChannel(channelId) {
  const mutation = `mutation{
    channelActivate(id:"${channelId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function updateChannelWarehouses(channelId, warehouseId) {
  const mutation = `mutation{
    channelUpdate(id:"${channelId}", input:{
      addWarehouses:"${warehouseId}"
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function updateChannelOrderSettings({
  channelId,
  automaticallyConfirmAllNewOrders = true,
  automaticallyFulfillNonShippableGiftCard = true,
  expireOrdersAfter = 0,
  markAsPaidStrategy = "PAYMENT_FLOW", // TRANSACTION_FLOW - creates the TransactionItem object.
  defaultTransactionFlowStrategy = "AUTHORIZATION",
}) {
  const mutation = `mutation{
    channelUpdate(id:"${channelId}",  input: {orderSettings: {
      automaticallyConfirmAllNewOrders: ${automaticallyConfirmAllNewOrders}, 
      automaticallyFulfillNonShippableGiftCard: ${automaticallyFulfillNonShippableGiftCard}, 
      expireOrdersAfter: ${expireOrdersAfter}, 
      markAsPaidStrategy: ${markAsPaidStrategy}, 
    }paymentSettings:{      defaultTransactionFlowStrategy: ${defaultTransactionFlowStrategy} 
  }}){
      errors{
        field
        message
      }
      channel {
        orderSettings{
          automaticallyConfirmAllNewOrders
          automaticallyFulfillNonShippableGiftCard
          expireOrdersAfter
          markAsPaidStrategy
        }
        paymentSettings {
          defaultTransactionFlowStrategy
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
