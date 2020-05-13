import ErrorMessageCard from "@saleor/components/ErrorMessageCard";
import { storiesOf } from "@storybook/react";
import React from "react";

storiesOf("Generics / ErrorMessageCard", module).add("default", () => (
  <ErrorMessageCard message="Loren ipsum dolor sit amet!" />
));
