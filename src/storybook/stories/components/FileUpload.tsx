import FileUpload from "@saleor/components/FileUpload";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../Decorator";

storiesOf("Components / FileUpload", module)
  .addDecorator(Decorator)
  .add("default", () => <FileUpload />)
  .add("other", () => <FileUpload />);
