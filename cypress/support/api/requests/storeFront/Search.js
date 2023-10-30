export function searchInShop(searchQuery) {
  const query = `query SearchProducts {
    products(channel: "default-channel", filter:{
      search: "${searchQuery}"
    },
    first:10){
      totalCount
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query, "token");
}
export function expectProductVisibleInShop(productName, retries = 0) {
  return searchInShop(productName).then(searchInShopResponse => {
    const productsList = searchInShopResponse.body.data.products;
    if (
      productsList.totalCount !== 0 &&
      productsList.edges[0].node.name === productName
    ) {
      cy.log(`Found product name: ${productName}`);
      return;
    } else if (retries > 4) {
      throw new Error(
        `Product with name ${productName} is not visible in search results. Retried for ${retries} times`,
      );
    } else {
      cy.wait(5000);
      expectProductVisibleInShop(productName, retries + 1);
    }
  });
}
