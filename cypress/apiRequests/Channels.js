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
      targetChannel: "${targetChannelId}"
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
