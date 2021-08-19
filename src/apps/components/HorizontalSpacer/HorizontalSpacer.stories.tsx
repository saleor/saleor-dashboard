import { Typography } from "@material-ui/core";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Spacer from "./Spacer";

interface HelperWrapperProps {
  children: React.ReactNode;
}

const HelperWrapper: React.FC<HelperWrapperProps> = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "row" }}>{children}</div>
);

const Text: React.FC = () => <Typography>{"<- The spacer is here"}</Typography>;

storiesOf("Generic / Horizontal Spacer", module)
  .addDecorator(Decorator)
  .add("without", () => (
    <HelperWrapper>
      <Typography>No spacer</Typography>
    </HelperWrapper>
  ))
  .add("default", () => (
    <HelperWrapper>
      <Spacer />
      <Text />
    </HelperWrapper>
  ))
  .add("with bigger spacing provided", () => (
    <HelperWrapper>
      <Spacer spacing={4} />
      <Text />
    </HelperWrapper>
  ));
