import { Box } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import { topBarHeight } from "../consts";

export const TopNavWrapper = ({
  children,
  withoutBorder,
}: {
  withoutBorder?: boolean;
  children: ReactNode;
}) => (
  <Box
    display="flex"
    alignItems="center"
    paddingX={6}
    paddingY={5}
    borderBottomWidth={withoutBorder ? 0 : 1}
    borderBottomStyle="solid"
    borderColor="default1"
    position="relative"
    data-test-id="page-header"
    __height={topBarHeight}
    gridColumn="8"
    gridRowStart="1"
    backgroundColor="default1"
  >
    {children}
  </Box>
);
