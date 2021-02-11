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
    cy.sendRequestWithQuery(createChannelMutation);
  }

  deleteTestChannels(nameStartsWith) {
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
    cy.sendRequestWithQuery(getChannelsInfoQuery).then(resp => {
      const channels = new Set(resp.body.data.channels);
      channels.forEach(element => {
        if (element.name.startsWith(nameStartsWith)) {
          const targetChannels = Array.from(channels).filter(function(channel) {
            return (
              element.currencyCode === channel.currencyCode &&
              element.id !== channel.id
            );
          });
          if (targetChannels[0]) {
            this.deleteChannel(element.id, targetChannels[0].id);
            channels.delete(element);
          }
        }
      });
    });
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
