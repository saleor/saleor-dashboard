class Search {
  searchInShop(searchQuery) {
    const query = `query SearchProducts {
        products(channel: "default-channel", filter:{
          search: "${searchQuery}"
        }, first:10){
          totalCount
          edges{
            node{
              id
              name
            }
          }
        }
      }`;

    return cy.sendFrontShopRequestWithQuery(query);
  }
}
export default Search;
