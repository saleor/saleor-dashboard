export function updatePlugin(id, name, value) {
  const mutation = `mutation{
    pluginUpdate(id:"${id}", input:{
      configuration:{
        name:"${name}"
        value:"${value}"
      }
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
