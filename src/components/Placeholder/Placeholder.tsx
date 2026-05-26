import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./Placeholder.module.css";

interface PlaceholderProps {
  children: ReactNode;
}

// Note: `borderStyle: "dashed"` lives in a CSS module because
// macaw-ui-next's `borderStyle` sprinkle only ships `"none" | "solid"`.
export const Placeholder = ({ children }: PlaceholderProps) => (
  <Box
    className={styles.placeholder}
    borderRadius={4}
    borderColor="default1"
    borderWidth={1}
    padding={4}
    display="flex"
    justifyContent="center"
  >
    <Text size={2} color="default2" textAlign="center">
      {children}
    </Text>
  </Box>
);
