import { OutputData } from "@editorjs/editorjs";
import RichTextEditor from "@saleor/components/RichTextEditor";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import * as fixtures from "./fixtures.json";
import { RichTextEditorProps } from "./RichTextEditor";
import RichTextEditorContent from "./RichTextEditorContent";

export const data: OutputData = fixtures.richTextEditor;

const props: RichTextEditorProps = {
  data,
  disabled: false,
  error: false,
  helperText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  label: "Content",
  name: "content",
  onChange: () => undefined
};

export default {
  title: "Generics / Rich text editor",
  decorators: [CardDecorator, Decorator],
  excludeStories: ["data"]
};

export const Default = () => <RichTextEditor {...props} />;

Default.story = {
  name: "default"
};

export const Disabled = () => <RichTextEditor {...props} disabled={true} />;

Disabled.story = {
  name: "disabled"
};

export const Error = () => <RichTextEditor {...props} error={true} />;

Error.story = {
  name: "error"
};

export const Static = () => <RichTextEditorContent {...props} />;

Static.story = {
  name: "static"
};
