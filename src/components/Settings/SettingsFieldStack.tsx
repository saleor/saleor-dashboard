import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

interface SettingsFieldStackProps {
  children: ReactNode;
  intro?: ReactNode;
}

/**
 * Stack of form fields inside a SettingsSection, with consistent padding.
 */
export const SettingsFieldStack = ({ children, intro }: SettingsFieldStackProps): JSX.Element => {
  return (
    <Box paddingX={6} paddingY={5} display="flex" flexDirection="column" gap={4}>
      {intro}
      {children}
    </Box>
  );
};
