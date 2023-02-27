import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { useContentHeight } from "./useContentHeight";

interface ContentProps {
  [key: `data-${string}`]: string;
  children: React.ReactNode;
  noSavebar?: boolean;
  noTopNav?: boolean;
}

export const Content: React.FC<ContentProps> = ({
  children,
  noSavebar = false,
  noTopNav = false,
  ...rest
}) => {
  const { withoutSaveBar, withSaveBar } = useContentHeight();

  return (
    <Box
      __gridArea="content"
      __height={noSavebar ? withoutSaveBar() : withSaveBar({ noTopNav })}
      overflowY="auto"
      className="hide-scrollbar"
      {...rest}
    >
      {children}
    </Box>
  );
};
