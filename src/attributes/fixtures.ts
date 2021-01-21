import { AttributeDetailsFragment } from "@saleor/fragments/types/AttributeDetailsFragment";
import { ProductDetails_product_productType_variantAttributes } from "@saleor/products/types/ProductDetails";
import {
  AttributeInputTypeEnum,
  AttributeTypeEnum
} from "@saleor/types/globalTypes";

import { AttributeList_attributes_edges_node } from "./types/AttributeList";

export const attribute: AttributeDetailsFragment = {
  __typename: "Attribute" as "Attribute",
  availableInGrid: true,
  entityType: null,
  filterableInDashboard: false,
  filterableInStorefront: true,
  id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
  inputType: AttributeInputTypeEnum.DROPDOWN,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  name: "Author",
  privateMetadata: [],
  slug: "author",
  storefrontSearchPosition: 2,
  type: AttributeTypeEnum.PRODUCT_TYPE,
  valueRequired: true,
  values: [
    {
      __typename: "AttributeValue" as "AttributeValue",
      file: null,
      id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
      name: "John Doe",
      reference: null,
      slug: "john-doe"
    },
    {
      __typename: "AttributeValue" as "AttributeValue",
      file: null,
      id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
      name: "Milionare Pirate",
      reference: null,
      slug: "milionare-pirate"
    }
  ],
  visibleInStorefront: true
};

export const attributes: Array<AttributeList_attributes_edges_node &
  ProductDetails_product_productType_variantAttributes> = [
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo5",
      name: "Author",
      slug: "author",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI0",
          name: "John Doe",
          reference: null,
          slug: "john-doe",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI1",
          name: "Milionare Pirate",
          reference: null,
          slug: "milionare-pirate",
          sortOrder: 1,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo2",
      name: "Box Size",
      slug: "box-size",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE1",
          name: "100g",
          reference: null,
          slug: "100g",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE2",
          name: "250g",
          reference: null,
          slug: "250g",
          sortOrder: 1,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE3",
          name: "500g",
          reference: null,
          slug: "500g",
          sortOrder: 2,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE4",
          name: "1kg",
          reference: null,
          slug: "1kg",
          sortOrder: 3,
          value: ""
        }
      ],
      visibleInStorefront: false
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: false,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZToz",
      name: "Brand",
      slug: "brand",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjY=",
          name: "Saleor",
          reference: null,
          slug: "saleor",
          sortOrder: 0,
          value: ""
        }
      ],
      visibleInStorefront: false
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo4",
      name: "Candy Box Size",
      slug: "candy-box-size",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIx",
          name: "100g",
          reference: null,
          slug: "100g",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIy",
          name: "250g",
          reference: null,
          slug: "250g",
          sortOrder: 1,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIz",
          name: "500g",
          reference: null,
          slug: "500g",
          sortOrder: 2,
          value: ""
        }
      ],
      visibleInStorefront: false
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo1",
      name: "Coffee Genre",
      slug: "coffee-genre",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEz",
          name: "Arabica",
          reference: null,
          slug: "arabica",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE0",
          name: "Robusta",
          reference: null,
          slug: "robusta",
          sortOrder: 1,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: false,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZToy",
      name: "Collar",
      slug: "collar",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM=",
          name: "Round",
          reference: null,
          slug: "round",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjQ=",
          name: "V-Neck",
          reference: null,
          slug: "v-neck",
          sortOrder: 1,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjU=",
          name: "Polo",
          reference: null,
          slug: "polo",
          sortOrder: 2,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: false,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZTox",
      name: "Color",
      slug: "color",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE=",
          name: "Blue",
          reference: null,
          slug: "blue",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI=",
          name: "White",
          reference: null,
          slug: "white",
          sortOrder: 1,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: false,
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMg==",
      name: "Cover",
      slug: "cover",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMw",
          name: "Soft",
          reference: null,
          slug: "soft",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMx",
          name: "Hard",
          reference: null,
          slug: "hard",
          sortOrder: 1,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMy",
          name: "Middle soft",
          reference: null,
          slug: "middle-soft",
          sortOrder: 2,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjMz",
          name: "Middle hard",
          reference: null,
          slug: "middle-hard",
          sortOrder: 3,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM0",
          name: "Middle",
          reference: null,
          slug: "middle",
          sortOrder: 4,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjM1",
          name: "Very hard",
          reference: null,
          slug: "very-hard",
          sortOrder: 5,
          value: ""
        }
      ],
      visibleInStorefront: false
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo3",
      name: "Flavor",
      slug: "flavor",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjE5",
          name: "Sour",
          reference: null,
          slug: "sour",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjIw",
          name: "Sweet",
          reference: null,
          slug: "sweet",
          sortOrder: 1,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: false,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMQ==",
      name: "Language",
      slug: "language",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI4",
          name: "English",
          reference: null,
          slug: "english",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI5",
          name: "Pirate",
          reference: null,
          slug: "pirate",
          sortOrder: 1,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZToxMA==",
      name: "Publisher",
      slug: "publisher",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI2",
          name: "Mirumee Press",
          reference: null,
          slug: "mirumee-press",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjI3",
          name: "Saleor Publishing",
          reference: null,
          slug: "saleor-publishing",
          sortOrder: 1,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  },
  {
    node: {
      __typename: "Attribute" as "Attribute",
      filterableInDashboard: true,
      filterableInStorefront: true,
      id: "UHJvZHVjdEF0dHJpYnV0ZTo0",
      name: "Size",
      slug: "size",
      type: AttributeTypeEnum.PRODUCT_TYPE,
      values: [
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjc=",
          name: "XS",
          reference: null,
          slug: "xs",
          sortOrder: 0,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjg=",
          name: "S",
          reference: null,
          slug: "s",
          sortOrder: 1,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjk=",
          name: "M",
          reference: null,
          slug: "m",
          sortOrder: 2,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEw",
          name: "L",
          reference: null,
          slug: "l",
          sortOrder: 3,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEx",
          name: "XL",
          reference: null,
          slug: "xl",
          sortOrder: 4,
          value: ""
        },
        {
          __typename: "AttributeValue" as "AttributeValue",
          file: null,
          id: "UHJvZHVjdEF0dHJpYnV0ZVZhbHVlOjEy",
          name: "XXL",
          reference: null,
          slug: "xxl",
          sortOrder: 5,
          value: ""
        }
      ],
      visibleInStorefront: true
    }
  }
].map(edge => edge.node);
