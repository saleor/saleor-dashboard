export function getPageType(pageTypeId) {
  const query = `query{
    pageType(id:"${pageTypeId}"){
      id
      name
      attributes{
        name
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.pageType");
}

export function createPageType(name) {
  const mutation = `mutation{
    pageTypeCreate(input:{ name: "${name}"}){
      pageType{
        name
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.pageTypeCreate");
}
