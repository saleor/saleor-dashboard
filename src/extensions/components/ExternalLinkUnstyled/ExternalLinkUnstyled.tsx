import { ExternalLinkNext } from "@dashboard/components/ExternalLink";
import { TextProps } from "@saleor/macaw-ui-next";
import React, { HTMLAttributes } from "react";

export const ExternalLinkUnstyled = (
  props: TextProps & Omit<HTMLAttributes<HTMLAnchorElement>, "children">,
) => {
  return (
    <ExternalLinkNext
      color="inherit"
      __fontSize="inherit"
      __fontWeight="inherit"
      borderBottomStyle="solid"
      borderWidth={1}
      {...props}
    />
  );
};
