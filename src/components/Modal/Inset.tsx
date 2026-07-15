import { Box, type PropsWithBox } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { MODAL_BODY_INSET_PADDING_BLOCK_SPACING, MODAL_PADDING_SPACING } from "./tokens";

export const Inset = ({ children, ...rest }: PropsWithBox<{ children: ReactNode }>) => {
  return (
    <Box
      paddingX={MODAL_PADDING_SPACING}
      paddingY={MODAL_BODY_INSET_PADDING_BLOCK_SPACING}
      {...rest}
    >
      {children}
    </Box>
  );
};
