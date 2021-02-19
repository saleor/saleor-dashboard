class Collections {
  getCollection(collectionId, channelSlug) {
    const operationName = "Collection";
    const variables = {
      attributes: {},
      priceGte: null,
      priceLte: null,
      sortBy: null,
      channel: channelSlug,
      id: collectionId,
      pageSize: 6
    };
    const query =
      "query Collection($id: ID!, $channel: String!) {\n  collection(id: $id, channel: $channel) {\n    id\n    slug\n    name\n    seoDescription\n    seoTitle\n    backgroundImage {\n      url\n      __typename\n    }\n    __typename\n  }\n  attributes(filter: {channel: $channel, inCollection: $id, filterableInStorefront: true}, first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        values {\n          id\n          name\n          slug\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n";
    return cy.sendFrontShopRequest(operationName, query, variables);
  }
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
          }
        }
      }
    }`;
    return cy.sendRequestWithQuery(query);
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
