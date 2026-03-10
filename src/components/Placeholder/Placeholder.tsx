import { Box, Text } from "@macaw-ui";
import { type ReactNode } from "react";

interface PlaceholderProps {
  children: ReactNode;
}

export const Placeholder = ({ children }: PlaceholderProps) => (
  <Box
    borderRadius={4}
    borderStyle="solid"
    borderColor="default1"
    borderWidth={1}
    padding={4}
    display="flex"
    justifyContent="center"
  >
    <Text size={2} color="default2">
      {children}
    </Text>
  </Box>
);
