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
      const channels = resp.body.data.channels;
      if (channels) {
        channels.forEach(element => {
          if (element.name.startsWith(nameStartsWith)) {
            channels.forEach(targetElement => {
              if (
                element.currencyCode === targetElement.currencyCode &&
                element.id !== targetElement.id
              ) {
                this.deleteChannel(element.id, targetElement.id);
              }
            });
          }
        });
      }
    });
  }

  deleteChannel(channelId, targetChennelId) {
    const deleteChannelMutation = `mutation{
            channelDelete(id: "${channelId}", input:{
              targetChannel: "${targetChennelId}"
            }){
              channelErrors{
                message
              }
            }
          }`;
    cy.sendRequestWithQuery(deleteChannelMutation);
  }
}
export default Channels;
