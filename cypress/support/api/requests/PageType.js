import { getValueWithDefault } from "./utils/Utils";

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

export function createPageType({ name, attributeId }) {
  const attributeLine = getValueWithDefault(
    attributeId,
    `addAttributes:["${attributeId}"]`
  );

  const mutation = `mutation{
    pageTypeCreate(input:{ name: "${name}" ${attributeLine}}){
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

export function getPageTypes(first, search) {
  const query = `query{
    pageTypes(first: ${first}, filter:{
      search:"${search}"
    }){
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.pageTypes.edges);
}

export function deletePageType(pageTypeId) {
  const mutation = `mutation{
    pageTypeDelete(id:"${pageTypeId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
