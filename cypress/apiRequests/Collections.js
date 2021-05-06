export function createCollection(name, slug = name) {
  const mutation = `mutation {
    collectionCreate(input:{
      name:"${name}",
      slug:"${name}"
    }){
      collectionErrors{
        field
        message
      }
      collection{
        name
        id
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.collectionCreate.collection");
}
export function getCollections(search) {
  const filter = search
    ? `, filter:{
        search:""
      }`
    : "";
  const query = `query{
    collections(first:100 ${filter}){
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
    .then(resp => resp.body.data.collections.edges);
}
export function deleteCollection(collectionId) {
  const mutation = `mutation{
    collectionDelete(id:"${collectionId}"){
      collection{
        id
      }
      collectionErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
