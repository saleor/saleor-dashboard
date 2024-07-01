import { Root as Portal } from "@radix-ui/react-portal";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { savebarHeight } from "../AppLayout/consts";
import { useSavebarRef } from "./SavebarRefContext";

export interface SavebarProps {
  children: React.ReactNode;
}

export const SavebarRoot = ({ children }: SavebarProps) => {
  const { anchor } = useSavebarRef();

  if (!anchor.current) {
    return null;
  }

  return (
    <Portal container={anchor.current} asChild>
      <Box __height={savebarHeight} backgroundColor="default1">
        <Box display="flex" alignItems="center" gap={3} paddingX={6} height="100%">
          {children}
        </Box>
      </Box>
    </Portal>
  );
};

export const Spacer = () => <Box __flex={1} />;
