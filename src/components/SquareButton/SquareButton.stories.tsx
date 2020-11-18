import CloseIcon from "@material-ui/icons/Close";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import SquareButton from "./SquareButton";

storiesOf("Generics / Square Button", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <SquareButton>
      <CloseIcon />
    </SquareButton>
  ));
