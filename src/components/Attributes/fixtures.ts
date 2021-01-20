import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum
} from "@saleor/types/globalTypes";

import { AttributeInput } from "./Attributes";

const DROPDOWN_ATTRIBUTE: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.DROPDOWN,
    isRequired: true,
    values: [
      {
        __typename: "AttributeValue",
        file: null,
        id: "fdinugiffgffd",
        name: "Dropdown First Value",
        reference: null,
        slug: "dropdown-first-value"
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "fdhfdhdihidff",
        name: "Dropdown Second Value",
        reference: null,
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
        file: null,
        id: "terteretregtt",
        name: "Multiselect First Value",
        reference: null,
        slug: "multiselect-first-value"
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "tyueyryetopwr",
        name: "Multiselect Second Value",
        reference: null,
        slug: "multiselect-second-value"
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "truiwrtweirqd",
        name: "Multiselect Third Value",
        reference: null,
        slug: "multiselect-third-value"
      }
    ]
  },
  id: "idffuidhffl",
  label: "Multiselect Attribute",
  value: []
};

const FILE_ATTRIBUTE: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.FILE,
    isRequired: true,
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
        reference: null,
        slug: "file-first-value"
      }
    ]
  },
  id: "fguygygugyu",
  label: "File Attribute",
  value: []
};

const REFERENCE_ATTRIBUTE: AttributeInput = {
  data: {
    entityType: AttributeEntityTypeEnum.PAGE,
    inputType: AttributeInputTypeEnum.REFERENCE,
    isRequired: true,
    references: [
      {
        label: "References First Value",
        value: "vbnhgcvjhbvhj"
      },
      {
        label: "References Second Value",
        value: "gucngdfdfvdvd"
      },
      {
        label: "References Third Value",
        value: "dfdfdsfdsfdse"
      }
    ],
    values: [
      {
        __typename: "AttributeValue",
        file: null,
        id: "vbnhgcvjhbvhj",
        name: "References First Value",
        reference: null,
        slug: "references-first-value"
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "gucngdfdfvdvd",
        name: "References Second Value",
        reference: null,
        slug: "references-second-value"
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "dfdfdsfdsfdse",
        name: "References Third Value",
        reference: null,
        slug: "references-third-value"
      }
    ]
  },
  id: "kclsmcdsmcs",
  label: "References Attribute",
  value: []
};

export const ATTRIBUTES: AttributeInput[] = [
  DROPDOWN_ATTRIBUTE,
  MULTISELECT_ATTRIBUTE,
  FILE_ATTRIBUTE,
  REFERENCE_ATTRIBUTE
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
  },
  {
    ...FILE_ATTRIBUTE,
    value: [FILE_ATTRIBUTE.data.values[0].slug]
  },
  {
    ...REFERENCE_ATTRIBUTE,
    value: [
      REFERENCE_ATTRIBUTE.data.values[0].id,
      REFERENCE_ATTRIBUTE.data.values[1].id,
      REFERENCE_ATTRIBUTE.data.values[2].id
    ]
  }
];
