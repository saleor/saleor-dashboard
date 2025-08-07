import { Box } from "@saleor/macaw-ui-next";
import React from "react";

/**
 * @deprecated use `Divider` component from `@saleor/macaw-ui-next`
 */
export const Hr = ({ className }: { className?: string }) => (
  <Box
    as="hr"
    className={className}
    backgroundColor="default3"
    borderWidth={0}
    width="100%"
    height="px"
  />
);

Hr.displayName = "Hr";
export default Hr;
