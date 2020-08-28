import { CategoryFragment } from "@saleor/fragments/types/CategoryFragment";

import { content } from "../storybook/stories/components/RichTextEditor";
import { CategoryDetails_category } from "./types/CategoryDetails";

export const categories: CategoryFragment[] = [
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 2
    },
    id: "123123",
    name: "Lorem ipsum dolor",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 54
    },
    id: "876752",
    name: "Mauris vehicula tortor vulputate",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 3
    }
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 2
    },
    id: "876542",
    name: "Excepteur sint occaecat cupidatat non proident",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 6
    }
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 6
    },
    id: "875352",
    name: "Ut enim ad minim veniam",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 12
    }
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 76
    },
    id: "865752",
    name: "Duis aute irure dolor in reprehenderit",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 43
    }
  },
  {
    __typename: "Category",
    children: {
      __typename: "CategoryCountableConnection",
      totalCount: 11
    },
    id: "878752",
    name: "Neque porro quisquam est",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 21
    }
  }
];
export const category: (
  placeholderImage: string
) => CategoryDetails_category = (placeholderImage: string) => ({
  __typename: "Category",
  backgroundImage: {
    __typename: "Image",
    alt: "Alt text",
    url: placeholderImage
  },
  children: {
    __typename: "CategoryCountableConnection",
    edges: [],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjk=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA="
    }
  },
  descriptionJson: JSON.stringify(content),
  id: "Q2F0ZWdvcnk6NA==",
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "Coffees",
  parent: {
    __typename: "Category",
    id: "Q2F0ZWdvcnk6Mw=="
  },
  privateMetadata: [],
  products: {
    __typename: "ProductCountableConnection",
    edges: [
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjA=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyMQ==",
          isAvailable: true,
          name: "Gardner-Schultz",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjE=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyMg==",
          isAvailable: true,
          name: "James, Martinez and Murray",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjI=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyMw==",
          isAvailable: true,
          name: "Curtis, Joyce and Turner",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjM=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyNA==",
          isAvailable: true,
          name: "Davis, Brown and Ray",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjQ=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyNQ==",
          isAvailable: true,
          name: "Gallegos Ltd",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjU=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyNg==",
          isAvailable: true,
          name: "Franklin Inc",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjY=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyNw==",
          isAvailable: true,
          name: "Williams-Taylor",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjc=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyOA==",
          isAvailable: true,
          name: "Riddle, Evans and Hicks",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjg=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyOQ==",
          isAvailable: true,
          name: "Hebert-Sherman",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjk=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDozMA==",
          isAvailable: true,
          name: "Carter and Sons",
          pricing: {
            __typename: "ProductPricingInfo",
            priceRangeUndiscounted: {
              __typename: "TaxedMoneyRange",
              start: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 3,
                  currency: "USD"
                }
              },
              stop: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 8,
                  currency: "USD"
                }
              }
            }
          },
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mw==",
            name: "Coffee"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "YXJyYXljb25uZWN0aW9uOjk=",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "YXJyYXljb25uZWN0aW9uOjA="
    }
  },
  seoDescription: null,
  seoTitle: null
});
export const errors = [
  {
    field: "name",
    message: "To pole jest wymagane."
  }
];
