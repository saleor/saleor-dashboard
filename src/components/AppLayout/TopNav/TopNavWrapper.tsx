import { Box, type BoxProps } from "@saleor/macaw-ui-next";
import type * as React from "react";

import { topBarHeight, topBarHeightSubtitle, topBarHeightSubtitleTop } from "../consts";

export const TopNavWrapper = ({
  children,
  withoutBorder,
  hasSubtitle,
  hasSubtitleTop,
  ...props
}: {
  children?: React.ReactNode;
  withoutBorder?: boolean;
  hasSubtitle?: boolean;
  hasSubtitleTop?: boolean;
} & BoxProps) => {
  const getHeight = () => {
    if (hasSubtitle) {
      return topBarHeightSubtitle;
    }

    if (hasSubtitleTop) {
      return topBarHeightSubtitleTop;
    }

    return topBarHeight;
  };

  return (
    <Box
      display={hasSubtitle || hasSubtitleTop ? "block" : "flex"}
      alignItems="center"
      paddingX={6}
      paddingY={5}
      borderBottomWidth={withoutBorder ? 0 : 1}
      borderBottomStyle="solid"
      borderColor="default1"
      position="relative"
      data-test-id="page-header"
      __height={getHeight()}
      gridColumn="8"
      gridRowStart="1"
      backgroundColor="default1"
      {...props}
    >
      {children}
    </Box>
  );
};
