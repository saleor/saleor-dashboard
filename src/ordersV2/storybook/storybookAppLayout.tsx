import { Box } from "@saleor/macaw-ui-next";
import * as React from "react";

export const StorybookAppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="grid" __gridTemplateColumns="auto 1fr" fontFamily="Geist">
      <Box
        __width={"260px"}
        height="100vh"
        backgroundColor="default2"
        top={0}
        borderLeftWidth={0}
        borderTopWidth={0}
        borderBottomWidth={0}
      />
      <Box height="100%" width="100%" overflow="hidden">
        <Box as="main" width="100%" height="100%">
          {children}
        </Box>
        <Box
          bottom={0}
          left={0}
          right={0}
          backgroundColor="default1"
          borderTopWidth={1}
          borderTopStyle="solid"
          borderColor="default1"
          zIndex="2"
        />
      </Box>
    </Box>
  );
};
