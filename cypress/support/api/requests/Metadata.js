export function updateMetadata(token, key, value) {
  const mutation = `mutation{
    updateMetadata(id:"${token}" input:{
      key:"${key}",
      value:"${value}"
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.updateMetadata");
}

export function updatePrivateMetadata(token, key, value) {
  const mutation = `mutation{
    updatePrivateMetadata(id:"${token}" input:{
      key:"${key}",
      value:"${value}"
    }){
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.updatePrivateMetadata");
}
