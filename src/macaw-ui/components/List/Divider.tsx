import { ReactNode } from "react";

import { Box, PropsWithBox } from "../Box";
import { DataAttributes } from "../types";

export type ListDividerProps = PropsWithBox<
  DataAttributes & {
    children?: ReactNode;
  }
>;

export const Divider = ({ children, ...rest }: ListDividerProps) => {
  return (
    <Box as="li" {...rest} data-macaw-ui-component="List.Divider">
      {children}
    </Box>
  );
};

Divider.displayName = "List.Divider";
