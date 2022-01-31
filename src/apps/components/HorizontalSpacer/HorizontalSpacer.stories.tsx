import { Typography } from "@material-ui/core";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import HorizontalSpacer from "./HorizontalSpacer";

interface HelperWrapperProps {
  children: React.ReactNode;
}

const HelperWrapper: React.FC<HelperWrapperProps> = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "row" }}>{children}</div>
);

const Text: React.FC = () => <Typography>{"<- The spacer is here"}</Typography>;

storiesOf("Generics / Horizontal Spacer", module)
  .addDecorator(Decorator)
  .add("without", () => (
    <HelperWrapper>
      <Typography>No spacer</Typography>
    </HelperWrapper>
  ))
  .add("default", () => (
    <HelperWrapper>
      <HorizontalSpacer />
      <Text />
    </HelperWrapper>
  ))
  .add("with bigger spacing provided", () => (
    <HelperWrapper>
      <HorizontalSpacer spacing={4} />
      <Text />
    </HelperWrapper>
  ));
