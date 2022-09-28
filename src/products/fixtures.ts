import {
  AttributeInputTypeEnum,
  ProductFragment,
  ProductListQuery,
  ProductMediaType,
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
  WeightUnitsEnum,
} from "@saleor/graphql";
import { ProductType } from "@saleor/sdk/dist/apollo/types";
import { RelayToFlat } from "@saleor/types";
import { warehouseList } from "@saleor/warehouses/fixtures";

import * as richTextEditorFixtures from "../components/RichTextEditor/fixtures.json";

const content = richTextEditorFixtures.richTextEditor;

export const product: (
  placeholderImage: string,
) => ProductFragment &
  ProductVariantCreateDataQuery["product"] = placeholderImage => ({
  __typename: "Product" as "Product",
  attributes: [
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        entityType: null,
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Borders",
        slug: "Borders",
        valueRequired: false,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav47282",
                name: "portals",
                reference: null,
                slug: "portals",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav17253",
                name: "Baht",
                reference: null,
                slug: "Baht",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav47282",
          name: "portals",
          reference: null,
          slug: "portals",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        entityType: null,
        id: "pta22785",
        inputType: AttributeInputTypeEnum.MULTISELECT,
        name: "Legacy",
        slug: "Legacy",
        valueRequired: true,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav31282",
                name: "payment",
                reference: null,
                slug: "payment",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav14907",
                name: "Auto Loan Account",
                reference: null,
                slug: "Auto-Loan-Account",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav27366",
                name: "Garden",
                reference: null,
                slug: "Garden",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav11873",
                name: "override",
                reference: null,
                slug: "override",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav14907",
          name: "Auto Loan Account",
          reference: null,
          slug: "Auto-Loan-Account",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
  ],
  availableForPurchase: null,
  category: {
    __typename: "Category",
    id: "Q2F0ZWdvcnk6MQ==",
    name: "Apparel",
  },
  channelListings: [
    {
      __typename: "ProductChannelListing",
      availableForPurchase: null,
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "123",
        name: "Channel1",
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
              currency: "USD",
            },
          },
          stop: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 3.5,
              currency: "USD",
            },
          },
        },
      },
      publicationDate: "2020-07-14",
      visibleInListings: true,
    },
    {
      __typename: "ProductChannelListing",
      availableForPurchase: null,
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "124",
        name: "Channel2",
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
              currency: "USD",
            },
          },
          stop: {
            __typename: "TaxedMoney",
            net: {
              __typename: "Money",
              amount: 3.5,
              currency: "USD",
            },
          },
        },
      },
      publicationDate: "2020-07-30",
      visibleInListings: true,
    },
  ],
  chargeTaxes: true,
  collections: [
    {
      __typename: "Collection",
      id: "Q29sbGVjdGlvbjoy",
      name: "Winter sale",
    },
  ],
  defaultVariant: { __typename: "ProductVariant", id: "pv75934" },
  description: JSON.stringify(content),
  id: "p10171",
  isAvailable: false,
  isAvailableForPurchase: false,
  isFeatured: false,
  margin: { __typename: "Margin", start: 2, stop: 7 },
  media: [
    {
      __typename: "ProductMedia",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdEltYWdlOjE=",
      sortOrder: 0,
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdEltYWdlOaE=",
      sortOrder: 2,
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      alt: "Id sit dolores adipisci",
      id: "UPJvZHVjdEltYWdlOjV=",
      sortOrder: 1,
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdEltYHdlOjX=",
      sortOrder: 3,
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      alt: "Id sit dolores adipisci",
      id: "UHJvZHVjdIlnYWdlOjX=",
      sortOrder: 4,
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
  ],
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
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
        entityType: null,
        id: "isdugfhud",
        inputType: AttributeInputTypeEnum.FILE,
        name: "Attachment",
        slug: "attachment",
        valueRequired: true,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: {
                  __typename: "File",
                  contentType: "image/png",
                  url: "some-non-existing-url",
                },
                id: "gdghdgdhkkdae",
                name: "File First Value",
                reference: null,
                slug: "file-first-value",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
    ],
    selectionVariantAttributes: [
      {
        __typename: "Attribute",
        entityType: null,
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Color",
        slug: "color",
        valueRequired: true,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptvav47282",
                name: "Black",
                reference: null,
                slug: "black",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptvav17253",
                name: "White",
                reference: null,
                slug: "white",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
    ],
    taxType: {
      __typename: "TaxType",
      description: "standard",
      taxCode: "standard",
    },
    variantAttributes: [
      {
        __typename: "Attribute",
        id: "isdugfhud",
        name: "Attachment",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        valueRequired: false,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: {
                  __typename: "File",
                  contentType: "image/png",
                  url: "some-non-existing-url",
                },
                id: "gdghdgdhkkdae",
                name: "File First Value",
                reference: null,
                slug: "file-first-value",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
      {
        __typename: "Attribute",
        id: "pta18161",
        name: "Color",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        valueRequired: false,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptvav47282",
                name: "Black",
                reference: null,
                slug: "black",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptvav17253",
                name: "White",
                reference: null,
                slug: "white",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
    ],
  },
  publicationDate: "2018-08-25T18:45:54.125Z",
  purchaseCost: {
    __typename: "MoneyRange",
    start: {
      __typename: "Money",
      amount: 339.39,
      currency: "NZD",
      localized: "339.39 NZD",
    },
    stop: {
      __typename: "Money",
      amount: 678.78,
      currency: "NZD",
      localized: "678.78 NZD",
    },
  },
  rating: 100,
  seoDescription: "Seo description",
  seoTitle: "Seo title",
  sku: "59661-34207",
  slug: "Borders",
  taxType: {
    __typename: "TaxType",
    description: "standard",
    taxCode: "standard",
  },
  thumbnail: { __typename: "Image" as "Image", url: placeholderImage },
  url: "/example-url",
  variants: [
    {
      __typename: "ProductVariant",
      channelListings: [],
      id: "pv75934",
      quantityLimitPerCustomer: 30,
      margin: 2,
      media: [
        {
          __typename: "ProductMedia",
          id: "pi92837",
          type: ProductMediaType.IMAGE,
          oembedData: "{}",
          url: placeholderImage,
        },
        {
          __typename: "ProductMedia",
          id: "pi92838",
          type: ProductMediaType.IMAGE,
          oembedData: "{}",
          url: placeholderImage,
        },
      ],
      name: "Cordoba Oro",
      sku: "87192-94370",
      stocks: [
        {
          __typename: "Stock",
          id: "1",
          quantity: 1,
          quantityAllocated: 0,
          warehouse: warehouseList[0],
        },
        {
          __typename: "Stock",
          id: "2",
          quantity: 4,
          quantityAllocated: 2,
          warehouse: warehouseList[1],
        },
      ],
      trackInventory: true,
      preorder: {
        __typename: "PreorderData",
        endDate: null,
        globalSoldUnits: null,
        globalThreshold: 0,
      },
    },
    {
      __typename: "ProductVariant",
      quantityLimitPerCustomer: null,
      channelListings: [
        {
          __typename: "ProductVariantChannelListing",
          channel: {
            __typename: "Channel",
            currencyCode: "USD",
            id: "123",
            name: "Channel1",
          },
          costPrice: {
            __typename: "Money",
            amount: 10,
            currency: "USD",
          },
          price: {
            __typename: "Money",
            amount: 1,
            currency: "USD",
          },
          preorderThreshold: {
            __typename: "PreorderThreshold",
            quantity: 0,
            soldUnits: 0,
          },
        },
        {
          __typename: "ProductVariantChannelListing",
          channel: {
            __typename: "Channel",
            currencyCode: "USD",
            id: "124",
            name: "Channel2",
          },
          costPrice: {
            __typename: "Money",
            amount: 10,
            currency: "USD",
          },
          price: {
            __typename: "Money",
            amount: 1,
            currency: "USD",
          },
          preorderThreshold: {
            __typename: "PreorderThreshold",
            quantity: 0,
            soldUnits: 0,
          },
        },
      ],
      id: "pv68615",
      margin: 7,
      media: [
        {
          __typename: "ProductMedia",
          id: "pi81234",
          type: ProductMediaType.IMAGE,
          oembedData: "{}",
          url: placeholderImage,
        },
        {
          __typename: "ProductMedia",
          id: "pi1236912",
          type: ProductMediaType.IMAGE,
          oembedData: "{}",
          url: placeholderImage,
        },
      ],
      name: "silver",
      sku: "69055-15190",
      stocks: [
        {
          __typename: "Stock",
          id: "1",
          quantity: 13,
          quantityAllocated: 2,
          warehouse: warehouseList[0],
        },
      ],
      trackInventory: false,
      preorder: {
        __typename: "PreorderData",
        endDate: null,
        globalSoldUnits: null,
        globalThreshold: 0,
      },
    },
  ],
  visibleInListings: true,
  weight: {
    __typename: "Weight",
    unit: WeightUnitsEnum.KG,
    value: 5,
  },
});
export const products = (
  placeholderImage: string,
): RelayToFlat<ProductListQuery["products"]> => [
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDo2MQ==",
    name: "Nebula Night Sky Paint",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6Nw==",
      name: "Paint",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo2NA==",
    name: "Light Speed Yellow Paint",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6Nw==",
      name: "Paint",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo2NQ==",
    name: "Hyperspace Turquoise Paint",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6Nw==",
      name: "Paint",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6MQ==",
            name: "Pineapple",
            reference: null,
            slug: "pineapple",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo3NQ==",
    name: "Pineapple Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6Mg==",
            name: "Coconut",
            reference: null,
            slug: "coconut",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo3Ng==",
    name: "Coconut Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6Mw==",
            name: "Apple",
            reference: null,
            slug: "apple",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },

      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo3Mg==",
    name: "Apple Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NDk=",
            name: "Orange",
            reference: null,
            slug: "orange",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo3MQ==",
    name: "Orange Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTA=",
            name: "Banana",
            reference: null,
            slug: "banana",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo3NA==",
    name: "Banana Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTE=",
            name: "Bean",
            reference: null,
            slug: "bean",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDo3OQ==",
    name: "Bean Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTI=",
            name: "Carrot",
            reference: null,
            slug: "carrot",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDo3Mw==",
    name: "Carrot Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjE2",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NTM=",
            name: "Sprouty",
            reference: null,
            slug: "sprouty",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDo3OA==",
    name: "Green Juice",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6OQ==",
      name: "Juice",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDo4OQ==",
    name: "Code Division T-shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDoxMDc=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDoxMDg=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDoxMDk=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDoxMTA=",
    name: "Polo Shirt",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: false,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: false,
      },
    ],
    id: "UHJvZHVjdDoxMTU=",
    name: "Black Hoodie",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDoxMTY=",
    name: "Blue Hoodie",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjI1",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6ODI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDoxMTc=",
    name: "Mustard Hoodie",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTQ=",
      name: "Top (clothing)",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
  {
    __typename: "Product",
    updatedAt: "2020-06-22T13:52:05.094636+00:00",
    attributes: [
      {
        __typename: "SelectedAttribute",
        attribute: {
          __typename: "Attribute",
          id: "QXR0cmlidXRlOjIz",
        },
        values: [
          {
            __typename: "AttributeValue",
            file: null,
            id: "QXR0cmlidXRlVmFsdWU6NzI=",
            name: "Cotton",
            reference: null,
            slug: "cotton",
            boolean: null,
            date: null,
            dateTime: null,
            value: null,
          },
        ],
      },
    ],
    channelListings: [
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "123",
          name: "Channel1",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-14",
        visibleInListings: true,
      },
      {
        __typename: "ProductChannelListing",
        availableForPurchase: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "124",
          name: "Channel2",
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
                currency: "USD",
              },
            },
            stop: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 3.5,
                currency: "USD",
              },
            },
          },
        },
        publicationDate: "2020-07-30",
        visibleInListings: true,
      },
    ],
    id: "UHJvZHVjdDo4NQ==",
    name: "Colored Parrot Cushion",
    productType: {
      __typename: "ProductType",
      hasVariants: true,
      id: "UHJvZHVjdFR5cGU6MTI=",
      name: "Cushion",
    },
    thumbnail: {
      __typename: "Image",
      url: placeholderImage,
    },
  },
];

export const variant = (placeholderImage: string): ProductVariantFragment => ({
  __typename: "ProductVariant",
  channelListings: [
    {
      __typename: "ProductVariantChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "test1",
        name: "Test channel",
      },
      costPrice: {
        __typename: "Money",
        amount: 10,
        currency: "USD",
      },
      price: {
        __typename: "Money",
        amount: 10,
        currency: "USD",
      },
      preorderThreshold: {
        __typename: "PreorderThreshold",
        quantity: 0,
        soldUnits: 0,
      },
    },
    {
      __typename: "ProductVariantChannelListing",
      channel: {
        __typename: "Channel",
        currencyCode: "USD",
        id: "test2",
        name: "Test channel other",
      },
      costPrice: {
        __typename: "Money",
        amount: 10,
        currency: "USD",
      },
      price: {
        __typename: "Money",
        amount: 20,
        currency: "USD",
      },
      preorderThreshold: {
        __typename: "PreorderThreshold",
        quantity: 0,
        soldUnits: 0,
      },
    },
  ],
  id: "var1",
  quantityLimitPerCustomer: 300,
  media: [
    {
      __typename: "ProductMedia",
      id: "img1",
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      id: "img2",
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      id: "img7",
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
    {
      __typename: "ProductMedia",
      id: "img8",
      type: ProductMediaType.IMAGE,
      oembedData: "{}",
      url: placeholderImage,
    },
  ],
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123",
    },
  ],
  name: "Extended Hard",
  nonSelectionAttributes: [
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute",
        entityType: null,
        id: "nfnyffcf8eyfm",
        inputType: AttributeInputTypeEnum.FILE,
        name: "Attachment",
        slug: "attachment",
        valueRequired: true,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: {
                  __typename: "File",
                  contentType: "image/png",
                  url: "some-non-existing-url",
                },
                id: "gdghdgdhkkdae",
                name: "File First Value",
                reference: null,
                slug: "file-first-value",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
      values: [
        {
          __typename: "AttributeValue",
          file: {
            __typename: "File",
            contentType: "image/png",
            url: "some-non-existing-url",
          },
          id: "gdghdgdhkkdae",
          name: "File First Value",
          reference: null,
          slug: "file-first-value",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
  ],
  privateMetadata: [],
  product: {
    __typename: "Product" as "Product",
    channelListings: [
      {
        __typename: "ProductChannelListing",
        isPublished: false,
        publicationDate: null,
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "test1",
          name: "Test channel",
        },
      },
      {
        __typename: "ProductChannelListing",
        isPublished: true,
        publicationDate: "2022-01-21",
        channel: {
          __typename: "Channel",
          currencyCode: "USD",
          id: "test2",
          name: "Test channel other",
        },
      },
    ],
    defaultVariant: {
      __typename: "ProductVariant",
      id: "var1",
    },
    id: "prod1",
    media: [
      {
        __typename: "ProductMedia",
        alt: "Front",
        id: "img1",
        sortOrder: 1,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Back",
        id: "img2",
        sortOrder: 4,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Right side",
        id: "img3",
        sortOrder: 2,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Left side",
        id: "img4",
        sortOrder: 3,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Paper",
        id: "img5",
        sortOrder: 0,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Hard cover",
        id: "img6",
        sortOrder: 1,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Extended version",
        id: "img7",
        sortOrder: 0,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Cut version",
        id: "img8",
        sortOrder: 2,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
      {
        __typename: "ProductMedia",
        alt: "Soft cover",
        id: "img9",
        sortOrder: 2,
        type: ProductMediaType.IMAGE,
        oembedData: "{}",
        url: placeholderImage,
      },
    ],
    name: "Our Awesome Book",
    thumbnail: { __typename: "Image" as "Image", url: placeholderImage },
    variants: [
      {
        __typename: "ProductVariant",
        id: "var1",
        media: [
          {
            __typename: "ProductMedia",
            id: "23123",
            type: ProductMediaType.IMAGE,
            oembedData: "{}",
            url: placeholderImage,
          },
        ],
        name: "Extended Hard",
        sku: "13-1337",
      },
      {
        __typename: "ProductVariant",
        id: "var2",
        media: [
          {
            __typename: "ProductMedia",
            id: "23123",
            type: ProductMediaType.IMAGE,
            oembedData: "{}",
            url: placeholderImage,
          },
        ],
        name: "Extended Soft",
        sku: "13-1338",
      },
      {
        __typename: "ProductVariant",
        id: "var3",
        media: [
          {
            __typename: "ProductMedia",
            id: "23123",
            type: ProductMediaType.IMAGE,
            oembedData: "{}",
            url: placeholderImage,
          },
        ],
        name: "Normal Hard",
        sku: "13-1339",
      },
      {
        __typename: "ProductVariant",
        id: "var4",
        media: [
          {
            __typename: "ProductMedia",
            id: "23123",
            type: ProductMediaType.IMAGE,
            oembedData: "{}",
            url: placeholderImage,
          },
        ],
        name: "Normal Soft",
        sku: "13-1340",
      },
    ],
  },
  selectionAttributes: [
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        entityType: null,
        id: "pta18161",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Borders",
        slug: "Borders",
        valueRequired: true,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav47282",
                name: "portals",
                reference: null,
                slug: "portals",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav17253",
                name: "Baht",
                reference: null,
                slug: "Baht",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav47282",
          name: "portals",
          reference: null,
          slug: "portals",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
    {
      __typename: "SelectedAttribute",
      attribute: {
        __typename: "Attribute" as "Attribute",
        entityType: null,
        id: "pta22785",
        inputType: AttributeInputTypeEnum.DROPDOWN,
        name: "Legacy",
        slug: "Legacy",
        valueRequired: true,
        unit: null,
        choices: {
          __typename: "AttributeValueCountableConnection",
          pageInfo: {
            endCursor: "WyI4IiwgIjMiXQ==",
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "WyIwIiwgIjQ5Il0=",
            __typename: "PageInfo",
          },
          edges: [
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav31282",
                name: "payment",
                reference: null,
                slug: "payment",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav14907",
                name: "Auto Loan Account",
                reference: null,
                slug: "Auto-Loan-Account",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav27366",
                name: "Garden",
                reference: null,
                slug: "Garden",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
            {
              __typename: "AttributeValueCountableEdge",
              cursor: "",
              node: {
                __typename: "AttributeValue",
                file: null,
                id: "ptav11873",
                name: "override",
                reference: null,
                slug: "override",
                plainText: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                value: null,
              },
            },
          ],
        },
      },
      values: [
        {
          __typename: "AttributeValue",
          file: null,
          id: "ptav14907",
          name: "Auto Loan Account",
          reference: null,
          slug: "Auto-Loan-Account",
          plainText: null,
          richText: null,
          boolean: null,
          date: null,
          dateTime: null,
          value: null,
        },
      ],
    },
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
        name: "Warehouse 1",
      },
    },
    {
      __typename: "Stock",
      id: "2",
      quantity: 4,
      quantityAllocated: 2,
      warehouse: {
        __typename: "Warehouse",
        id: "1234",
        name: "Warehouse 2",
      },
    },
  ],
  trackInventory: true,
  preorder: {
    __typename: "PreorderData",
    endDate: null,
    globalSoldUnits: null,
    globalThreshold: 0,
  },
  weight: {
    __typename: "Weight",
    unit: WeightUnitsEnum.KG,
    value: 6,
  },
});
export const variantMedia = (placeholderImage: string) =>
  variant(placeholderImage).media;
export const variantProductImages = (placeholderImage: string) =>
  variant(placeholderImage).product.media;
export const variantSiblings = (placeholderImage: string) =>
  variant(placeholderImage).product.variants;

export const productTypesList: Array<Pick<
  ProductType,
  "id" | "name" | "hasVariants"
>> = [
  {
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6Nw==",
    name: "Salt",
  },
  {
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6Nw==",
    name: "Sugar",
  },
  {
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6Nw==",
    name: "Mushroom",
  },
];
