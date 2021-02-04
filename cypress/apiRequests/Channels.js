class Channels {
  createChannel(isActive, name, slug, currencyCode) {
    const createChannelMutation = `mutation{
                channelCreate(input: {
                  isActive: ${isActive}
                  name: "${name}"
                  slug: "${slug}"
                  currencyCode: "${currencyCode}"
                }){
                  channel{
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

  getChannels() {
    const getChannelsInfoQuery = `query{
        channels{
          name
          id
          isActive
          slug
          currencyCode
        }
      }
      `;
    return cy.sendRequestWithQuery(getChannelsInfoQuery);
  }

  deleteChannel(channelId, targetChennelId) {
    const deleteChannelMutation = `mutation{
              channelDelete(id: "${channelId}", input:{
                targetChannel: "${targetChennelId}"
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
}
export default Channels;
