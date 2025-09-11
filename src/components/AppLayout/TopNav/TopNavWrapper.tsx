import { Box, BoxProps } from "@saleor/macaw-ui-next";
import * as React from "react";

import { topBarHeight, topBarHeightSubtitle } from "../consts";

export const TopNavWrapper = ({
  children,
  withoutBorder,
  hasSubtitle,
  ...props
}: {
  children?: React.ReactNode;
  withoutBorder?: boolean;
  hasSubtitle?: boolean;
} & BoxProps) => (
  <Box
    display={hasSubtitle ? "block" : "flex"}
    alignItems="center"
    paddingX={6}
    paddingY={5}
    borderBottomWidth={withoutBorder ? 0 : 1}
    borderBottomStyle="solid"
    borderColor="default1"
    position="relative"
    data-test-id="page-header"
    __height={hasSubtitle ? topBarHeightSubtitle : topBarHeight}
    gridColumn="8"
    gridRowStart="1"
    backgroundColor="default1"
    {...props}
  >
    {children}
  </Box>
);
