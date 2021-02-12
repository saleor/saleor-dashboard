/* eslint-disable sort-keys */

Cypress.Commands.add("searchInShop", searchQuery =>
  cy.request({
    method: "POST",
    url: Cypress.env("API_URI"),
    body: [
      {
        operationName: "SearchProducts",
        variables: {
          attributes: {},
          channel: "default-channel",
          pageSize: 6,
          priceGte: null,
          priceLte: null,
          query: searchQuery,
          sortBy: null
        },
        query:
          "fragment Price on TaxedMoney {\n  gross {\n    amount\n    currency\n    __typename\n  }\n  net {\n    amount\n    currency\n    __typename\n  }\n  __typename\n}\n\nfragment ProductPricingField on Product {\n  pricing {\n    onSale\n    priceRangeUndiscounted {\n      start {\n        ...Price\n        __typename\n      }\n      stop {\n        ...Price\n        __typename\n      }\n      __typename\n    }\n    priceRange {\n      start {\n        ...Price\n        __typename\n      }\n      stop {\n        ...Price\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nquery SearchProducts($query: String!, $channel: String!, $attributes: [AttributeInput], $pageSize: Int, $sortBy: ProductOrder, $after: String) {\n  products(channel: $channel, filter: {search: $query, attributes: $attributes}, first: $pageSize, sortBy: $sortBy, after: $after) {\n    totalCount\n    edges {\n      node {\n        ...ProductPricingField\n        id\n        name\n        thumbnail {\n          url\n          alt\n          __typename\n        }\n        thumbnail2x: thumbnail(size: 510) {\n          url\n          __typename\n        }\n        category {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      __typename\n    }\n    __typename\n  }\n  attributes(filter: {filterableInStorefront: true}, first: 100) {\n    edges {\n      node {\n        id\n        name\n        slug\n        values {\n          id\n          name\n          slug\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
      }
    ]
  })
);
Cypress.Commands.add("getProductDetails", (productId, channelId) =>
  cy.request({
    method: "POST",
    url: Cypress.env("API_URI"),
    body: [
      {
        operationName: "ProductDetails",
        variables: {
          channel: channelId,
          id: productId
        },
        query:
          "fragment BasicProductFields on Product {\n  id\n  name\n  thumbnail {\n    url\n    alt\n    __typename\n  }\n  thumbnail2x: thumbnail(size: 510) {\n    url\n    __typename\n  }\n  __typename\n}\n\nfragment SelectedAttributeFields on SelectedAttribute {\n  attribute {\n    id\n    name\n    __typename\n  }\n  values {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment Price on TaxedMoney {\n  gross {\n    amount\n    currency\n    __typename\n  }\n  net {\n    amount\n    currency\n    __typename\n  }\n  __typename\n}\n\nfragment ProductVariantFields on ProductVariant {\n  id\n  sku\n  name\n  quantityAvailable(countryCode: $countryCode)\n  images {\n    id\n    url\n    alt\n    __typename\n  }\n  pricing {\n    onSale\n    priceUndiscounted {\n      ...Price\n      __typename\n    }\n    price {\n      ...Price\n      __typename\n    }\n    __typename\n  }\n  attributes(variantSelection: VARIANT_SELECTION) {\n    attribute {\n      id\n      name\n      slug\n      __typename\n    }\n    values {\n      id\n      name\n      value: name\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment ProductPricingField on Product {\n  pricing {\n    onSale\n    priceRangeUndiscounted {\n      start {\n        ...Price\n        __typename\n      }\n      stop {\n        ...Price\n        __typename\n      }\n      __typename\n    }\n    priceRange {\n      start {\n        ...Price\n        __typename\n      }\n      stop {\n        ...Price\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nquery ProductDetails($id: ID!, $channel: String, $countryCode: CountryCode) {\n  product(id: $id, channel: $channel) {\n    ...BasicProductFields\n    ...ProductPricingField\n    description\n    category {\n      id\n      name\n      products(first: 3, channel: $channel) {\n        edges {\n          node {\n            ...BasicProductFields\n            ...ProductPricingField\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    images {\n      id\n      alt\n      url\n      __typename\n    }\n    attributes {\n      ...SelectedAttributeFields\n      __typename\n    }\n    variants {\n      ...ProductVariantFields\n      __typename\n    }\n    seoDescription\n    seoTitle\n    isAvailable\n    isAvailableForPurchase\n    availableForPurchase\n    __typename\n  }\n}\n"
      }
    ]
  })
);
