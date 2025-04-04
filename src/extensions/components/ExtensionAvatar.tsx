import { Box } from "@saleor/macaw-ui-next";
import React from "react";

interface ExtensionAvatarProps {
  children: React.ReactNode;
}

export const ExtensionAvatar = ({ children }: ExtensionAvatarProps) => {
  return (
    <Box
      __width="40px"
      __height="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={1.5}
      borderRadius={3}
      borderColor="default1"
      borderStyle="solid"
      borderWidth={1}
      overflow="hidden"
    >
      {children}
    </Box>
  );
};
