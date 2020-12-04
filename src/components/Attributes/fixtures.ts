import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";

import { AttributeInput } from "./Attributes";

const DROPDOWN_ATTRIBUTE: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.DROPDOWN,
    isRequired: true,
    values: [
      {
        __typename: "AttributeValue",
        id: "fdinugiffgffd",
        name: "Dropdown First Value",
        slug: "dropdown-first-value"
      },
      {
        __typename: "AttributeValue",
        id: "fdhfdhdihidff",
        name: "Dropdown Second Value",
        slug: "dropdown-second-value"
      }
    ]
  },
  id: "ifudbgidfsb",
  label: "Dropdown Attribute",
  value: []
};

const MULTISELECT_ATTRIBUTE: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.MULTISELECT,
    isRequired: true,
    values: [
      {
        __typename: "AttributeValue",
        id: "terteretregtt",
        name: "Multiselect First Value",
        slug: "multiselect-first-value"
      },
      {
        __typename: "AttributeValue",
        id: "tyueyryetopwr",
        name: "Multiselect Second Value",
        slug: "multiselect-second-value"
      },
      {
        __typename: "AttributeValue",
        id: "truiwrtweirqd",
        name: "Multiselect Third Value",
        slug: "multiselect-third-value"
      }
    ]
  },
  id: "idffuidhffl",
  label: "Multiselect Attribute",
  value: []
};

export const ATTRIBUTES: AttributeInput[] = [
  DROPDOWN_ATTRIBUTE,
  MULTISELECT_ATTRIBUTE
];

export const ATTRIBUTES_SELECTED: AttributeInput[] = [
  {
    ...DROPDOWN_ATTRIBUTE,
    value: [DROPDOWN_ATTRIBUTE.data.values[0].slug]
  },
  {
    ...MULTISELECT_ATTRIBUTE,
    value: [
      MULTISELECT_ATTRIBUTE.data.values[0].slug,
      MULTISELECT_ATTRIBUTE.data.values[1].slug
    ]
  }
];
