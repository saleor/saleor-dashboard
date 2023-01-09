export function updatePlugin(id, name, value, channel) {
  const channelLine = channel ? `channelId: "${channel}"` : "";

  const mutation = `mutation{
    pluginUpdate(
      id:"${id}", 
      ${channelLine},
      input:{
      configuration:[{
        name:"${name}",
        value:"${value}"
      }]
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function activatePlugin({ id, channel, active = true }) {
  const channelLine = channel ? `channelId: "${channel}"` : "";

  const mutation = `mutation{
    pluginUpdate(id: "${id}" ${channelLine} input:{
      active:${active}
    }){
      errors{
        field
        message
      }
    } 
  }`;
  return cy.sendRequestWithQuery(mutation);
}
