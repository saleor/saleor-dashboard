import { content } from "../storybook/stories/components/RichTextEditor";
import { CollectionDetails_collection } from "./types/CollectionDetails";
import { CollectionList_collections_edges_node } from "./types/CollectionList";

export const collections: CollectionList_collections_edges_node[] = [
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjox",
    isPublished: true,
    name: "Summer collection",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoy",
    isPublished: true,
    name: "Winter sale",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoz",
    isPublished: true,
    name: "Vintage vibes",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoa",
    isPublished: true,
    name: "Merry Christmas",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjob",
    isPublished: true,
    name: "80s Miami",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  },
  {
    __typename: "Collection",
    id: "Q29sbGVjdGlvbjoc",
    isPublished: true,
    name: "Yellow Submarine 2019",
    products: {
      __typename: "ProductCountableConnection",
      totalCount: 4
    }
  }
];
export const collection: (
  placeholderCollectionImage: string,
  placeholderProductImage: string
) => CollectionDetails_collection = (
  placeholderCollectionImage,
  placeholderImage
) => ({
  __typename: "Collection",
  backgroundImage: {
    __typename: "Image",
    alt: "Alt text",
    url: placeholderCollectionImage
  },
  descriptionJson: JSON.stringify(content),
  id: "Q29sbGVjdGlvbjox",
  isPublished: true,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "Summer collection",
  privateMetadata: [],
  products: {
    __typename: "ProductCountableConnection",
    edges: [
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjA=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoxNw==",
          isPublished: true,
          name: "Murray Inc",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Mg==",
            name: "Mugs"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      },
      {
        __typename: "ProductCountableEdge",
        cursor: "YXJyYXljb25uZWN0aW9uOjE=",
        node: {
          __typename: "Product",
          id: "UHJvZHVjdDoyNw==",
          isPublished: true,
          name: "Williams-Taylor",
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
          id: "UHJvZHVjdDoyOQ==",
          isPublished: true,
          name: "Hebert-Sherman",
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
          id: "UHJvZHVjdDo1Mw==",
          isPublished: true,
          name: "Estes, Johnson and Graham",
          productType: {
            __typename: "ProductType",
            id: "UHJvZHVjdFR5cGU6Ng==",
            name: "Books"
          },
          thumbnail: { __typename: "Image", url: placeholderImage }
        }
      }
    ],
    pageInfo: {
      __typename: "PageInfo",
      endCursor: "",
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: ""
    }
  },
  publicationDate: "2018-08-25T18:45:54.125Z",
  seoDescription: "",
  seoTitle: "",
  slug: "summer-collection"
});
