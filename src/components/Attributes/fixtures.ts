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
        slug: "dropdown-first-value",
        richText: null
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "fdhfdhdihidff",
        name: "Dropdown Second Value",
        reference: null,
        slug: "dropdown-second-value",
        richText: null
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
        slug: "multiselect-first-value",
        richText: null
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "tyueyryetopwr",
        name: "Multiselect Second Value",
        reference: null,
        slug: "multiselect-second-value",
        richText: null
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "truiwrtweirqd",
        name: "Multiselect Third Value",
        reference: null,
        slug: "multiselect-third-value",
        richText: null
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
        slug: "file-first-value",
        richText: null
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
        slug: "references-first-value",
        richText: null
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "gucngdfdfvdvd",
        name: "References Second Value",
        reference: null,
        slug: "references-second-value",
        richText: null
      },
      {
        __typename: "AttributeValue",
        file: null,
        id: "dfdfdsfdsfdse",
        name: "References Third Value",
        reference: null,
        slug: "references-third-value",
        richText: null
      }
    ]
  },
  id: "kclsmcdsmcs",
  label: "References Attribute",
  value: []
};

const RICH_TEXT_ATTRIBUTE: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.RICH_TEXT,
    isRequired: true,
    values: [
      {
        __typename: "AttributeValue",
        file: null,
        id: "asdfafd",
        name: "Some cool text",
        reference: null,
        slug: "text",
        richText: JSON.stringify({
          time: 1617788754145,
          blocks: [{ data: { text: "Some cool text" }, type: "paragraph" }],
          version: "2.19.3"
        })
      }
    ],
    selectedValues: [
      {
        __typename: "AttributeValue",
        file: null,
        id: "asdfafd",
        name: "Some cool text",
        reference: null,
        slug: "text",
        richText: JSON.stringify({
          time: 1617788754145,
          blocks: [{ data: { text: "Some cool text" }, type: "paragraph" }],
          version: "2.19.3"
        })
      }
    ]
  },
  id: "asdfafd",
  label: "Text Attribute",
  value: []
};

const NUMERIC_ATTRIBUTE: AttributeInput = {
  data: {
    inputType: AttributeInputTypeEnum.NUMERIC,
    isRequired: true,
    values: [
      {
        __typename: "AttributeValue",
        file: null,
        id: "QXR0cmlidXRlVmFsdWU6MTAx",
        name: "12cm",
        reference: null,
        richText: null,
        slug: "319_35"
      }
    ]
  },
  id: "QXR0cmlidXRlOjM1",
  label: "Numeric Attribute",
  value: []
};

export const ATTRIBUTES: AttributeInput[] = [
  DROPDOWN_ATTRIBUTE,
  MULTISELECT_ATTRIBUTE,
  FILE_ATTRIBUTE,
  REFERENCE_ATTRIBUTE,
  RICH_TEXT_ATTRIBUTE,
  NUMERIC_ATTRIBUTE
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
  },
  {
    ...RICH_TEXT_ATTRIBUTE,
    value: [RICH_TEXT_ATTRIBUTE.data.values[0].richText]
  },
  {
    ...NUMERIC_ATTRIBUTE,
    value: [NUMERIC_ATTRIBUTE.data.values[0].name]
  }
];
