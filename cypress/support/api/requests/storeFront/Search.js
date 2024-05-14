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

export function expectProductVisibleInShop(productName, maxRetries = 5) {
  let retries = 0;

  return searchInShop(productName).then(searchInShopResponse => {
    const productsList = searchInShopResponse.body.data.products;
    if (
      productsList.totalCount !== 0 &&
      productsList.edges[0].node.name === productName
    ) {
      cy.log(`Found product name: ${productName}`);
      return;
    } else if (retries >= maxRetries) {
      throw new Error(
        `Product with name ${productName} is not visible in search results. Retried for ${maxRetries} times`,
      );
    } else {
      cy.wait(5000);
      retries++;
      expectProductVisibleInShop(productName);
    }
  });
}
