export function createChannel({
  isActive = true,
  name,
  slug = name,
  currencyCode = "PLN"
}) {
  const createChannelMutation = `mutation{
    channelCreate(input: {
      isActive: ${isActive}
      name: "${name}"
      slug: "${slug}"
      currencyCode: "${currencyCode}"
    }){
      channel{
        id
        name
        slug
      }
      channelErrors{
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
      channelErrors{
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
