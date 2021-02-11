/* eslint-disable sort-keys */
import { AttributeInputTypeEnum } from "@saleor/types/globalTypes";

import * as richTextEditorFixtures from "../components/RichTextEditor/fixtures.json";
import { PageDetails_page } from "./types/PageDetails";
import { PageList_pages_edges_node } from "./types/PageList";

const content = richTextEditorFixtures.richTextEditor;

export const pageList: PageList_pages_edges_node[] = [
  {
    __typename: "Page",
    id: "Jzx123sEt==",
    isPublished: true,
    slug: "about",
    title: "About"
  },
  {
    __typename: "Page",
    id: "Jzx123sEx==",
    isPublished: false,
    slug: "about",
    title: "About"
  },
  {
    __typename: "Page",
    id: "Jzx123sEu==",
    isPublished: true,
    slug: "about",
    title: "About"
  },
  {
    __typename: "Page",
    id: "Jzx123sEm==",
    isPublished: true,
    slug: "about",
    title: "About"
  }
];
export const page: PageDetails_page = {
  __typename: "Page",
  attributes: [
    {
      attribute: {
        id: "QXR0cmlidXRlOjI3",
        slug: "author",
        name: "Author",
        entityType: null,
        inputType: AttributeInputTypeEnum.DROPDOWN,
        valueRequired: false,
        values: [
          {
            id: "QXR0cmlidXRlVmFsdWU6ODc=",
            name: "Suzanne Ellison",
            slug: "suzanne-ellison",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6ODg=",
            name: "Dennis Perkins",
            slug: "dennis-perkins",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6ODk=",
            name: "Dylan Lamb",
            slug: "dylan-lamb",
            reference: null,
            __typename: "AttributeValue",
            file: null
          }
        ],
        __typename: "Attribute"
      },
      values: [
        {
          id: "QXR0cmlidXRlVmFsdWU6ODk=",
          name: "Dylan Lamb",
          slug: "dylan-lamb",
          reference: null,
          __typename: "AttributeValue",
          file: null
        }
      ],
      __typename: "SelectedAttribute"
    },
    {
      attribute: {
        id: "QXR0cmlidXRlOjI5",
        slug: "tag",
        name: "Tag",
        entityType: null,
        inputType: AttributeInputTypeEnum.MULTISELECT,
        valueRequired: false,
        values: [
          {
            id: "QXR0cmlidXRlVmFsdWU6OTA=",
            name: "Security",
            slug: "security",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6OTE=",
            name: "Support",
            slug: "support",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6OTI=",
            name: "Medical",
            slug: "medical",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6OTM=",
            name: "General",
            slug: "general",
            reference: null,
            __typename: "AttributeValue",
            file: null
          }
        ],
        __typename: "Attribute"
      },
      values: [
        {
          id: "QXR0cmlidXRlVmFsdWU6OTA=",
          name: "Security",
          slug: "security",
          reference: null,
          __typename: "AttributeValue",
          file: null
        }
      ],
      __typename: "SelectedAttribute"
    }
  ],
  content: JSON.stringify(content),
  id: "Kzx152sEm==",
  isPublished: false,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.id",
      value: "100023123"
    }
  ],
  pageType: {
    __typename: "PageType",
    id: "UGFnZVR5cGU6MQ==",
    name: "Blog",
    attributes: [
      {
        id: "QXR0cmlidXRlOjI3",
        name: "Author",
        entityType: null,
        inputType: AttributeInputTypeEnum.DROPDOWN,
        valueRequired: false,
        values: [
          {
            id: "QXR0cmlidXRlVmFsdWU6ODc=",
            name: "Suzanne Ellison",
            slug: "suzanne-ellison",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6ODg=",
            name: "Dennis Perkins",
            slug: "dennis-perkins",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6ODk=",
            name: "Dylan Lamb",
            slug: "dylan-lamb",
            reference: null,
            __typename: "AttributeValue",
            file: null
          }
        ],
        __typename: "Attribute"
      },
      {
        id: "QXR0cmlidXRlOjI5",
        name: "Tag",
        entityType: null,
        inputType: AttributeInputTypeEnum.MULTISELECT,
        valueRequired: false,
        values: [
          {
            id: "QXR0cmlidXRlVmFsdWU6OTA=",
            name: "Security",
            slug: "security",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6OTE=",
            name: "Support",
            slug: "support",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6OTI=",
            name: "Medical",
            slug: "medical",
            reference: null,
            __typename: "AttributeValue",
            file: null
          },
          {
            id: "QXR0cmlidXRlVmFsdWU6OTM=",
            name: "General",
            slug: "general",
            reference: null,
            __typename: "AttributeValue",
            file: null
          }
        ],
        __typename: "Attribute"
      }
    ]
  },
  privateMetadata: [],
  publicationDate: "",
  seoDescription: "About",
  seoTitle: "About",
  slug: "about",
  title: "About"
};
