import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React from "react";
import {
  SortableContainer as SortableContainerHOC,
  SortableElement as SortableElementHOC,
} from "react-sortable-hoc";

export const SortableContainer = SortableContainerHOC<BoxProps>(
  ({ children, ...props }: BoxProps) => <Box {...props}>{children}</Box>,
);

export const SortableElement = SortableElementHOC<BoxProps>(({ children, ...props }: BoxProps) => (
  <Box {...props}>{children}</Box>
));
