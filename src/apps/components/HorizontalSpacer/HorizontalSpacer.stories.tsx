import { Typography } from "@material-ui/core";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import HorizontalSpacer from "./HorizontalSpacer";

interface HelperWrapperProps {
  children: React.ReactNode;
}

const HelperWrapper: React.FC<HelperWrapperProps> = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "row" }}>{children}</div>
);

const Text: React.FC = () => <Typography>{"<- The spacer is here"}</Typography>;

export default {
  title: "Generics / Horizontal Spacer",
  decorators: [Decorator]
};

export const Without = () => (
  <HelperWrapper>
    <Typography>No spacer</Typography>
  </HelperWrapper>
);

Without.story = {
  name: "without"
};

export const Default = () => (
  <HelperWrapper>
    <HorizontalSpacer />
    <Text />
  </HelperWrapper>
);

Default.story = {
  name: "default"
};

export const WithBiggerSpacingProvided = () => (
  <HelperWrapper>
    <HorizontalSpacer spacing={4} />
    <Text />
  </HelperWrapper>
);

WithBiggerSpacingProvided.story = {
  name: "with bigger spacing provided"
};
