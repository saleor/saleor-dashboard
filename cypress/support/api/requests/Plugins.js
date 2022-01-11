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
