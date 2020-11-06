import { OutputData } from "@editorjs/editorjs";
import RichTextEditor from "@saleor/components/RichTextEditor";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import * as fixtures from "./fixtures.json";
import { RichTextEditorProps } from "./RichTextEditor";

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

storiesOf("Generics / Rich text editor", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <RichTextEditor {...props} />)
  .add("disabled", () => <RichTextEditor {...props} disabled={true} />)
  .add("error", () => <RichTextEditor {...props} error={true} />);
