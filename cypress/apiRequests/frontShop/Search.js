class Search {
  searchInShop(searchQuery) {
    const variables = {
      attributes: {},
      channel: "default-channel",
      pageSize: 6,
      priceGte: null,
      priceLte: null,
      query: searchQuery,
      sortBy: null
    };
    const query =
      "fragment Price on TaxedMoney {\n  gross {\n    amount\n    currency\n    __typename\n  }\n  net {\n    amount\n    currency\n    __typename\n  }\n  __typename\n}\n\nfragment ProductPricingField on Product {\n  pricing {\n    onSale\n    priceRangeUndiscounted {\n      start {\n        ...Price\n        __typename\n      }\n      stop {\n        ...Price\n        __typename\n      }\n      __typename\n    }\n    priceRange {\n      start {\n        ...Price\n        __typename\n      }\n      stop {\n        ...Price\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nquery SearchProducts($query: String!, $channel: String!, $attributes: [AttributeInput], $pageSize: Int, $sortBy: ProductOrder, $after: String) {\n  products(channel: $channel, filter: {search: $query, attributes: $attributes}, first: $pageSize, sortBy: $sortBy, after: $after) {\n    totalCount\n    edges {\n      node {\n        ...ProductPricingField\n        id\n        name\n        thumbnail {\n          url\n          alt\n          __typename\n        }\n        thumbnail2x: thumbnail(size: 510) {\n          url\n          __typename\n        }\n        category {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      __typename\n    }\n    __typename\n  }\n  attributes(filter: {filterableInStorefront: true}, first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        values {\n          id\n          name\n          slug\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n";

    return cy.sendFrontShopRequestWithQuery("SearchProducts", variables, query);
  }
}
export default Search;
