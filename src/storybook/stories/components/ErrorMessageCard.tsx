import ErrorMessageCard from "@saleor/components/ErrorMessageCard";
import CardDecorator from "@saleor/storybook/CardDecorator";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("Generics / ErrorMessageCard", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => (
    <ErrorMessageCard message="Loren ipsum dolor sit amet!" />
  ));
