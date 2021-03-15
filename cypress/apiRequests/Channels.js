export function createChannel(isActive, name, slug, currencyCode) {
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
  return cy.sendRequestWithQuery(createChannelMutation);
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
