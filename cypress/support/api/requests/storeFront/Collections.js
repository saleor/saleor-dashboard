export function getCollection(collectionId, channelSlug) {
  const query = `query Collection{
    collection(id: "${collectionId}", channel: "${channelSlug}") {
      id
      slug
      name
      products(first:100){
        totalCount
        edges{
          node{
            id
            name
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query, "token");
}
