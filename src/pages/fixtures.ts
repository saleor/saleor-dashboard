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
  contentJson: JSON.stringify(content),
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
    name: "Blog"
  },
  privateMetadata: [],
  publicationDate: "",
  seoDescription: "About",
  seoTitle: "About",
  slug: "about",
  title: "About"
};
