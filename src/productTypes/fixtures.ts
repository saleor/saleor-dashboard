import {
  SearchProductTypes_search_edges_node,
  SearchProductTypes_search_edges_node_productAttributes
} from "@saleor/searches/types/SearchProductTypes";

import {
  AttributeInputTypeEnum,
  AttributeTypeEnum,
  WeightUnitsEnum
} from "../types/globalTypes";
import { ProductTypeDetails_productType } from "./types/ProductTypeDetails";
import { ProductTypeList_productTypes_edges_node } from "./types/ProductTypeList";

export const attributes: SearchProductTypes_search_edges_node_productAttributes[] = [
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Author",
      slug: "author",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
          name: "John Doe",
          slug: "john-doe",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
          name: "Milionare Pirate",
          slug: "milionare-pirate",
          sortOrder: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo2",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Box Size",
      slug: "box-size",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE1",
          name: "100g",
          slug: "100g",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE2",
          name: "250g",
          slug: "250g",
          sortOrder: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE3",
          name: "500g",
          slug: "500g",
          sortOrder: 2,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE4",
          name: "1kg",
          slug: "1kg",
          sortOrder: 3,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToz",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Brand",
      slug: "brand",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjY=",
          name: "Saleor",
          slug: "saleor",
          sortOrder: 0,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo4",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Candy Box Size",
      slug: "candy-box-size",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIx",
          name: "100g",
          slug: "100g",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIy",
          name: "250g",
          slug: "250g",
          sortOrder: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIz",
          name: "500g",
          slug: "500g",
          sortOrder: 2,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo1",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Coffee Genre",
      slug: "coffee-genre",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEz",
          name: "Arabica",
          slug: "arabica",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE0",
          name: "Robusta",
          slug: "robusta",
          sortOrder: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToy",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Collar",
      slug: "collar",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM=",
          name: "Round",
          slug: "round",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjQ=",
          name: "V-Neck",
          slug: "v-neck",
          sortOrder: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjU=",
          name: "Polo",
          slug: "polo",
          sortOrder: 2,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTox",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Color",
      slug: "color",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE=",
          name: "Blue",
          slug: "blue",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI=",
          name: "White",
          slug: "white",
          sortOrder: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMg==",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Cover",
      slug: "cover",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMw",
          name: "Soft",
          slug: "soft",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMx",
          name: "Hard",
          slug: "hard",
          sortOrder: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMy",
          name: "Middle soft",
          slug: "middle-soft",
          sortOrder: 2,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMz",
          name: "Middle hard",
          slug: "middle-hard",
          sortOrder: 3,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM0",
          name: "Middle",
          slug: "middle",
          sortOrder: 4,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM1",
          name: "Very hard",
          slug: "very-hard",
          sortOrder: 5,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo3",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Flavor",
      slug: "flavor",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE5",
          name: "Sour",
          slug: "sour",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIw",
          name: "Sweet",
          slug: "sweet",
          sortOrder: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Language",
      slug: "language",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI4",
          name: "English",
          slug: "english",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI5",
          name: "Pirate",
          slug: "pirate",
          sortOrder: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Publisher",
      slug: "publisher",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI2",
          name: "Mirumee Press",
          slug: "mirumee-press",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI3",
          name: "Saleor Publishing",
          slug: "saleor-publishing",
          sortOrder: 1,
          type: "STRING",
          value: ""
        }
      ]
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      id: "UHJvZHVjdEF0dHJpYnV0ZTo0",
      inputType: AttributeInputTypeEnum.DROPDOWN,
      name: "Size",
      slug: "size",
      valueRequired: true,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjc=",
          name: "XS",
          slug: "xs",
          sortOrder: 0,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjg=",
          name: "S",
          slug: "s",
          sortOrder: 1,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjk=",
          name: "M",
          slug: "m",
          sortOrder: 2,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEw",
          name: "L",
          slug: "l",
          sortOrder: 3,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEx",
          name: "XL",
          slug: "xl",
          sortOrder: 4,
          type: "STRING",
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEy",
          name: "XXL",
          slug: "xxl",
          sortOrder: 5,
          type: "STRING",
          value: ""
        }
      ]
    }
  }
].map(edge => edge.node);

export const productTypes: Array<SearchProductTypes_search_edges_node &
  ProductTypeList_productTypes_edges_node> = [
  {
    __typename: "ProductType" as "ProductType",
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6NA==",
    isShippingRequired: true,
    name: "Candy",
    productAttributes: [attributes[0]],
    taxType: {
      __typename: "TaxType" as "TaxType",
      description: "PB100000",
      taxCode: "Books / Manuals"
    },
    variantAttributes: [attributes[1], attributes[2]]
  },
  {
    __typename: "ProductType" as "ProductType",
    hasVariants: false,
    id: "UHJvZHVjdFR5cGU6NQ==",
    isShippingRequired: false,
    name: "E-books",
    productAttributes: [attributes[5]],
    taxType: {
      __typename: "TaxType" as "TaxType",
      description: "PH403682",
      taxCode: "Holters"
    },
    variantAttributes: [attributes[0], attributes[3]]
  },
  {
    __typename: "ProductType" as "ProductType",
    hasVariants: false,
    id: "UHJvZHVjdFR5cGU6Mg==",
    isShippingRequired: true,
    name: "Mugs",
    productAttributes: [attributes[7]],
    taxType: {
      __typename: "TaxType" as "TaxType",
      description: "PC077426",
      taxCode: "Cabling"
    },
    variantAttributes: [attributes[2], attributes[5]]
  },
  {
    __typename: "ProductType" as "ProductType",
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6Mw==",
    isShippingRequired: true,
    name: "Coffee",
    productAttributes: [attributes[8]],
    taxType: {
      __typename: "TaxType" as "TaxType",
      description: "PB100000",
      taxCode: "Books / Manuals"
    },
    variantAttributes: [attributes[1], attributes[4]]
  },
  {
    __typename: "ProductType" as "ProductType",
    hasVariants: true,
    id: "UHJvZHVjdFR5cGU6MQ==",
    isShippingRequired: true,
    name: "T-Shirt",
    productAttributes: [attributes[4]],
    taxType: {
      __typename: "TaxType" as "TaxType",
      description: "PH403970",
      taxCode: "Wheelchair"
    },
    variantAttributes: [attributes[1], attributes[6]]
  }
].map(productType => ({
  __typename: "ProductType" as "ProductType",
  ...productType
}));
export const productType: ProductTypeDetails_productType = {
  __typename: "ProductType" as "ProductType",
  hasVariants: false,
  id: "UHJvZHVjdFR5cGU6NQ==",
  isShippingRequired: false,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "E-books",
  privateMetadata: [],
  productAttributes: [
    {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      visibleInStorefront: true
    },
    {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      visibleInStorefront: true
    },
    {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
      name: "Publisher",
      slug: "publisher",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      visibleInStorefront: true
    }
  ],
  taxType: {
    __typename: "TaxType" as "TaxType",
    description: "PH405458",
    taxCode: "Shields"
  },
  variantAttributes: [
    {
      ...attributes[1],
      filterableInDashboard: true,
      filterableInStorefront: false,
      type: AttributeTypeEnum.PRODUCT_TYPE,
      visibleInStorefront: true
    },
    {
      ...attributes[6],
      filterableInDashboard: true,
      filterableInStorefront: false,
      type: AttributeTypeEnum.PRODUCT_TYPE,
      visibleInStorefront: true
    }
  ],
  weight: {
    __typename: "Weight",
    unit: WeightUnitsEnum.KG,
    value: 7.82
  }
};
