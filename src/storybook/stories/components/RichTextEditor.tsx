import { OutputData } from "@editorjs/editorjs";
import RichTextEditor from "@saleor/components/RichTextEditor";
import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "../../CardDecorator";
import Decorator from "../../Decorator";
import * as fixtures from "./fixtures.json";

export const content: OutputData = fixtures.richTextEditor;

storiesOf("Generics / Rich text editor", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <RichTextEditor
      disabled={false}
      error={false}
      helperText="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      initial={content}
      label="Content"
      name="content"
      onChange={() => undefined}
    />
  ));
