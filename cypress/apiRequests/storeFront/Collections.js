class Collections {
  getCollection(collectionId, channelSlug) {
    const query = `query Collection{
        collection(id: "${collectionId}", channel: "${channelSlug}") {
          id
          slug
          name
          products(first:100){
            edges{
              node{
                id
                name
              }
            }
          }
        }
      }`;
    return cy.sendFrontShopRequestWithQuery(query);
  }
}
export default Collections;
