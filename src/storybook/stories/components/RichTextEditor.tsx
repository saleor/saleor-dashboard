import RichTextEditor from "@saleor/components/RichTextEditor";
import { storiesOf } from "@storybook/react";
import { RawDraftContentState } from "draft-js";
import React from "react";

import CardDecorator from "../../CardDecorator";
import Decorator from "../../Decorator";

export const content: RawDraftContentState = {
  blocks: [
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [{ length: 4, offset: 0, style: "BOLD" }],
      key: "rosn",
      text: "bold",
      type: "unstyled"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [{ length: 6, offset: 0, style: "ITALIC" }],
      key: "6tbch",
      text: "italic",
      type: "unstyled"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [{ length: 13, offset: 0, style: "STRIKETHROUGH" }],
      key: "1p044",
      text: "strikethrough",
      type: "unstyled"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: "aven6",
      text: "h1",
      type: "header-one"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: "9rabl",
      text: "h2",
      type: "header-two"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: "bv0ac",
      text: "h3",
      type: "header-three"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: "2ip7q",
      text: "blockquote",
      type: "blockquote"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: "8r8ss",
      text: "ul",
      type: "unordered-list-item"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [],
      key: "911hc",
      text: "ol",
      type: "ordered-list-item"
    },
    {
      data: {},
      depth: 0,
      entityRanges: [{ key: 0, length: 4, offset: 0 }],
      inlineStyleRanges: [],
      key: "5aejo",
      text: "link",
      type: "unstyled"
    }
  ],
  entityMap: {
    "0": { data: { url: "#" }, mutability: "MUTABLE", type: "LINK" }
  }
};
storiesOf("Generics / Rich text editor", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <RichTextEditor
      disabled={false}
      error={false}
      helperText={""}
      initial={content}
      label="Content"
      name="content"
      onChange={() => undefined}
    />
  ));
