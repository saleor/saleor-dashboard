class Collections {
  getCollections(search) {
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
  deleteCollection(collectionId) {
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
}
export default Collections;
