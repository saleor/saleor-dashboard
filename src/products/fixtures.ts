import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import {
  AttributeInputTypeEnum,
  WeightUnitsEnum
} from "@saleor/types/globalTypes";
import { warehouseList } from "@saleor/warehouses/fixtures";

import * as richTextEditorFixtures from "../components/RichTextEditor/fixtures.json";
import { ProductDetails_product } from "./types/ProductDetails";
import { ProductList_products_edges_node } from "./types/ProductList";
import { ProductVariantCreateData_product } from "./types/ProductVariantCreateData";

const content = richTextEditorFixtures.richTextEditor;

export const product: (
  placeholderImage: string
) => ProductDetails_product &
  ProductVariantCreateData_product = placeholderImage => ({
  __typename: "Product" as "Product",
  attributes: [
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Borders",
        slug: "Borders",
        valueRequired: false,
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav47282",
            name: "portals",
            slug: "portals"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav17253",
            name: "Baht",
            slug: "Baht"
          }
        ]
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav47282",
          name: "portals",
          slug: "portals"
        }
      ]
    },
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        id: "pta22785",
        inputType: AttributeInputTypeEnum.MULTISELECT,
        name: "Legacy",
        slug: "Legacy",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav31282",
            name: "payment",
            slug: "payment"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav14907",
            name: "Auto Loan Account",
            slug: "Auto-Loan-Account"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav27366",
            name: "Garden",
            slug: "Garden"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav11873",
            name: "override",
            slug: "override"
          }
        ]
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav14907",
          name: "Auto Loan Account",
          slug: "Auto-Loan-Account"
        }
      ]
    }
  ],
  availableForPurchase: null,
  category: {
    __typename: "Category",
    id: "Q2F0ZWdvcnk6MQ==",
    name: "Apparel"
  },
  channelListings: [
    {
      __typename: "ProductChannelListing",
      availableForPurchase: null,
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "123",
        name: "Channel1"
      },
      isAvailableForPurchase: false,
      isPublished: true,
      pricing: {
        __typename: "ProductPricingInfo",
        priceRange: {
          __typename: "TaxedMoneyRange",
          start: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 1.2,
              currency: "USD"
            }
          },
          stop: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 3.5,
              currency: "USD"
            }
          }
        }
      },
      publicationDate: "2020-07-14",
      visibleInListings: true
    },
    {
      __typename: "ProductChannelListing",
      availableForPurchase: null,
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "124",
        name: "Channel2"
      },
      isAvailableForPurchase: false,
      isPublished: false,
      pricing: {
        __typename: "ProductPricingInfo",
        priceRange: {
          __typename: "TaxedMoneyRange",
          start: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 1.2,
              currency: "USD"
            }
          },
          stop: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 3.5,
              currency: "USD"
            }
          }
        }
      },
      publicationDate: "2020-07-30",
      visibleInListings: true
    }
  ],
  chargeTaxes: true,
  collections: [
    {
      __typename: "Collection",
      id: "Q29sbGVjdGlvbjoy",
      name: "Winter sale"
    }
  ],
  defaultVariant: { __typename: "ProductVariant", id: "pv75934" },
  descriptionJson: JSON.stringify(content),
  id: "p10171",
  images: [
    {
      __typename: "ProductImage",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdEltYWdlOjE=",
      sortOrder: 0,
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdEltYWdlOaE=",
      sortOrder: 2,
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      alt: "Id sit dolores adipisci",
      id: "UPJvZHVjdEltYWdlOjV=",
      sortOrder: 1,
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdEltYHdlOjX=",
      sortOrder: 3,
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdIlnYWdlOjX=",
      sortOrder: 4,
      url: placeholderImage
    }
  ],
  isAvailable: false,
  isAvailableForPurchase: false,
  isFeatured: false,
  margin: { __typename: "Margin", start: 2, stop: 7 },
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "Ergonomic Plastic Bacon",
  privateMetadata: [],
  productType: {
    __typename: "ProductType",
    hasVariants: true,
    id: "pt76406",
    name: "Versatile",
    nonSelectionVariantAttributes: [
      {
        __typename: "Attribute",
        id: "isdugfhud",
        inputType: AttributeInputTypeEnum.FILE,
        name: "Attachment",
        slug: "attachment",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: {
              __typename: "File",
              contentType: "image/png",
              url: "some-non-existing-url"
            },
            id: "gdghdgdhkkdae",
            name: "File First Value",
            slug: "file-first-value"
          }
        ]
      }
    ],
    selectionVariantAttributes: [
      {
        __typename: "Attribute",
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Color",
        slug: "color",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptvav47282",
            name: "Black",
            slug: "black"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptvav17253",
            name: "White",
            slug: "white"
          }
        ]
      }
    ],
    taxType: {
      __typename: "TaxType",
      description: "standard",
      taxCode: "standard"
    },
    variantAttributes: [
      {
        __typename: "Attribute",
        id: "isdugfhud",
        inputType: AttributeInputTypeEnum.FILE,
        name: "Attachment",
        slug: "attachment",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: {
              __typename: "File",
              contentType: "image/png",
              url: "some-non-existing-url"
            },
            id: "gdghdgdhkkdae",
            name: "File First Value",
            slug: "file-first-value"
          }
        ]
      },
      {
        __typename: "Attribute",
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Color",
        slug: "color",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptvav47282",
            name: "Black",
            slug: "black"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptvav17253",
            name: "White",
            slug: "white"
          }
        ]
      }
    ]
  },
  publicationDate: "2018-08-25T18:45:54.125Z",
  purchaseCost: {
    __typename: "MoneyRange",
    start: {
      __typename: "Money",
      amount: 339.39,
      currency: "NZD",
      localized: "339.39 NZD"
    },
    stop: {
      __typename: "Money",
      amount: 678.78,
      currency: "NZD",
      localized: "678.78 NZD"
    }
  },
  rating: 100,
  seoDescription: "Seo description",
  seoTitle: "Seo title",
  sku: "59661-34207",
  slug: "Borders",
  taxType: {
    __typename: "TaxType",
    description: "standard",
    taxCode: "standard"
  },
  thumbnail: { __typename: "Image" as "Image", url: placeholderImage },
  url: "/example-url",
  variants: [
    {
      __typename: "ProductVariant",
      channelListings: [],
      id: "pv75934",
      images: [
        {
          __typename: "ProductImage",
          id: "pi92837",
          url: placeholderImage
        },
        {
          __typename: "ProductImage",
          id: "pi92838",
          url: placeholderImage
        }
      ],
      margin: 2,
      name: "Cordoba Oro",
      sku: "87192-94370",
      stocks: [
        {
          __typename: "Stock",
          id: "1",
          quantity: 1,
          quantityAllocated: 0,
          warehouse: warehouseList[0]
        },
        {
          __typename: "Stock",
          id: "2",
          quantity: 4,
          quantityAllocated: 2,
          warehouse: warehouseList[1]
        }
      ],
      trackInventory: true,
      weight: {
        __typename: "Weight",
        unit: WeightUnitsEnum.KG,
        value: 3
      }
    },
    {
      __typename: "ProductVariant",
      channelListings: [
        {
          __typename: "ProductVariantChannelListing",
          channel: {
            __typename: "Channel",
            currencyCode: "USD",
            id: "123",
            name: "Channel1"
          },
          costPrice: {
            __typename: "Money",
            amount: 10,
            currency: "USD"
          },
          price: {
            __typename: "Money",
            amount: 1,
            currency: "USD"
          }
        },
        {
          __typename: "ProductVariantChannelListing",
          channel: {
            __typename: "Channel",
            currencyCode: "USD",
            id: "124",
            name: "Channel2"
          },
          costPrice: {
            __typename: "Money",
            amount: 10,
            currency: "USD"
          },
          price: {
            __typename: "Money",
            amount: 1,
            currency: "USD"
          }
        }
      ],
      id: "pv68615",
      images: [
        {
          __typename: "ProductImage",
          id: "pi81234",
          url: placeholderImage
        },
        {
          __typename: "ProductImage",
          id: "pi1236912",
          url: placeholderImage
        }
      ],
      margin: 7,
      name: "silver",
      sku: "69055-15190",
      stocks: [
        {
          __typename: "Stock",
          id: "1",
          quantity: 13,
          quantityAllocated: 2,
          warehouse: warehouseList[0]
        }
      ],
      trackInventory: false,
      weight: {
        __typename: "Weight",
        unit: WeightUnitsEnum.KG,
        value: 4
      }
    }
  ],
  visibleInListings: true,
  weight: {
    __typename: "Weight",
    unit: WeightUnitsEnum.KG,
    value: 5
  }
});
export const products = (
  placeholderImage: string
): ProductList_products_edges_node[] => [
  {
    __typename: "Product",
    attributes: [],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDo2MQ==",
    name: "Nebula Night Sky Paint",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6Nw==",
      name: "Paint"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo2NA==",
    name: "Light Speed Yellow Paint",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6Nw==",
      name: "Paint"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo2NQ==",
    name: "Hyperspace Turquoise Paint",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6Nw==",
      name: "Paint"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6MQ==",
            name: "Pineapple",
            slug: "pineapple"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo3NQ==",
    name: "Pineapple Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6Mg==",
            name: "Coconut",
            slug: "coconut"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo3Ng==",
    name: "Coconut Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6Mw==",
            name: "Apple",
            slug: "apple"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },

      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo3Mg==",
    name: "Apple Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NDk=",
            name: "Orange",
            slug: "orange"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo3MQ==",
    name: "Orange Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTA=",
            name: "Banana",
            slug: "banana"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo3NA==",
    name: "Banana Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTE=",
            name: "Bean",
            slug: "bean"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDo3OQ==",
    name: "Bean Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTI=",
            name: "Carrot",
            slug: "carrot"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDo3Mw==",
    name: "Carrot Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTM=",
            name: "Sprouty",
            slug: "sprouty"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDo3OA==",
    name: "Green Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDo4OQ==",
    name: "Code Division T-shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDoxMDc=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDoxMDg=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDoxMDk=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDoxMTA=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: false
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: false
      }
    ],
    id: "UHJvZHVjdDoxMTU=",
    name: "Black Hoodie",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDoxMTY=",
    name: "Blue Hoodie",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDoxMTc=",
    name: "Mustard Hoodie",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  },
  {
    __typename: "Product",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjIz"
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NzI=",
            name: "Cotton",
            slug: "cotton"
          }
        ]
      }
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1"
        },
        isAvailableForPurchase: false,
        isPublished: true,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-14",
        visibleInListings: true
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2"
        },
        isAvailableForPurchase: false,
        isPublished: false,
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        },
        publicationDate: "2020-07-30",
        visibleInListings: true
      }
    ],
    id: "UHJvZHVjdDo4NQ==",
    name: "Colored Parrot Cushion",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTI=",
      name: "Cushion"
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage
    }
  }
];

export const variant = (placeholderImage: string): ProductVariant => ({
  __typename: "ProductVariant",
  channelListings: [
    {
      __typename: "ProductVariantChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "test1",
        name: "Test channel"
      },
      costPrice: {
        __typename: "Money",
        amount: 10,
        currency: "USD"
      },
      price: {
        __typename: "Money",
        amount: 10,
        currency: "USD"
      }
    },
    {
      __typename: "ProductVariantChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "test2",
        name: "Test channel other"
      },
      costPrice: {
        __typename: "Money",
        amount: 10,
        currency: "USD"
      },
      price: {
        __typename: "Money",
        amount: 20,
        currency: "USD"
      }
    }
  ],
  id: "var1",
  images: [
    {
      __typename: "ProductImage",
      id: "img1",
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      id: "img2",
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      id: "img7",
      url: placeholderImage
    },
    {
      __typename: "ProductImage",
      id: "img8",
      url: placeholderImage
    }
  ],
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "Extended Hard",
  nonSelectionAttributes: [
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute",
        id: "nfnyffcf8eyfm",
        inputType: AttributeInputTypeEnum.FILE,
        name: "Attachment",
        slug: "attachment",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: {
              __typename: "File",
              contentType: "image/png",
              url: "some-non-existing-url"
            },
            id: "gdghdgdhkkdae",
            name: "File First Value",
            slug: "file-first-value"
          }
        ]
      },
      values: [
        {
          __typename: "AttributeValue",
          file: {
            __typename: "File",
            contentType: "image/png",
            url: "some-non-existing-url"
          },
          id: "gdghdgdhkkdae",
          name: "File First Value",
          slug: "file-first-value"
        }
      ]
    }
  ],
  privateMetadata: [],
  product: {
    __typename: "Product" as "Product",
    channelListings: [
      {
        __typename: "ProductChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "test1",
          name: "Test channel"
        },
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        }
      },
      {
        __typename: "ProductChannelListing",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "test2",
          name: "Test channel other"
        },
        pricing: {
          __typename: "ProductPricingInfo",
          priceRange: {
            __typename: "TaxedMoneyRange",
            start: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 1.2,
                currency: "USD"
              }
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD"
              }
            }
          }
        }
      }
    ],
    defaultVariant: {
      __typename: "ProductVariant",
      id: "var1"
    },
    id: "prod1",
    images: [
      {
        __typename: "ProductImage",
        alt: "Front",
        id: "img1",
        sortOrder: 1,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Back",
        id: "img2",
        sortOrder: 4,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Right side",
        id: "img3",
        sortOrder: 2,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Left side",
        id: "img4",
        sortOrder: 3,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Paper",
        id: "img5",
        sortOrder: 0,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Hard cover",
        id: "img6",
        sortOrder: 1,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Extended version",
        id: "img7",
        sortOrder: 0,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Cut version",
        id: "img8",
        sortOrder: 2,
        url: placeholderImage
      },
      {
        __typename: "ProductImage",
        alt: "Soft cover",
        id: "img9",
        sortOrder: 2,
        url: placeholderImage
      }
    ],
    name: "Our Awesome Book",
    thumbnail: { __typename: "Image" as "Image", url: placeholderImage },
    variants: [
      {
        __typename: "ProductVariant",
        id: "var1",
        images: [
          {
            __typename: "ProductImage",
            id: "23123",
            url: placeholderImage
          }
        ],
        name: "Extended Hard",
        sku: "13-1337"
      },
      {
        __typename: "ProductVariant",
        id: "var2",
        images: [
          {
            __typename: "ProductImage",
            id: "23123",
            url: placeholderImage
          }
        ],
        name: "Extended Soft",
        sku: "13-1338"
      },
      {
        __typename: "ProductVariant",
        id: "var3",
        images: [
          {
            __typename: "ProductImage",
            id: "23123",
            url: placeholderImage
          }
        ],
        name: "Normal Hard",
        sku: "13-1339"
      },
      {
        __typename: "ProductVariant",
        id: "var4",
        images: [
          {
            __typename: "ProductImage",
            id: "23123",
            url: placeholderImage
          }
        ],
        name: "Normal Soft",
        sku: "13-1340"
      }
    ]
  },
  selectionAttributes: [
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Borders",
        slug: "Borders",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav47282",
            name: "portals",
            slug: "portals"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav17253",
            name: "Baht",
            slug: "Baht"
          }
        ]
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav47282",
          name: "portals",
          slug: "portals"
        }
      ]
    },
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        id: "pta22785",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Legacy",
        slug: "Legacy",
        valueRequired: true,
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav31282",
            name: "payment",
            slug: "payment"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav14907",
            name: "Auto Loan Account",
            slug: "Auto-Loan-Account"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav27366",
            name: "Garden",
            slug: "Garden"
          },
          {
            __typename: "AttributeValue",
            file: null,
            id: "ptav11873",
            name: "override",
            slug: "override"
          }
        ]
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav14907",
          name: "Auto Loan Account",
          slug: "Auto-Loan-Account"
        }
      ]
    }
  ],
  sku: "1230959124123",
  stocks: [
    {
      __typename: "Stock",
      id: "1",
      quantity: 1,
      quantityAllocated: 1,
      warehouse: {
        __typename: "Warehouse",
        id: "123",
        name: "Warehouse 1"
      }
    },
    {
      __typename: "Stock",
      id: "2",
      quantity: 4,
      quantityAllocated: 2,
      warehouse: {
        __typename: "Warehouse",
        id: "1234",
        name: "Warehouse 2"
      }
    }
  ],
  trackInventory: true,
  weight: {
    __typename: "Weight",
    unit: WeightUnitsEnum.KG,
    value: 6
  }
});
export const variantImages = (placeholderImage: string) =>
  variant(placeholderImage).images;
export const variantProductImages = (placeholderImage: string) =>
  variant(placeholderImage).product.images;
export const variantSiblings = (placeholderImage: string) =>
  variant(placeholderImage).product.variants;
