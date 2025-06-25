import { Box, Checkbox, CheckedState, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface HeaderProps {
  description: string;
  fullAccessLabel: string;
  disabled: boolean;
  hasFullAccess: boolean;
  onFullAccessChange: (checked: CheckedState) => void;
}

export const Header = ({
  description,
  disabled,
  hasFullAccess,
  fullAccessLabel,
  onFullAccessChange,
}: HeaderProps) => (
  <Box>
    <Text>{description}</Text>
    <Box marginTop={3} marginBottom={2}>
      <Checkbox
        disabled={disabled}
        checked={hasFullAccess}
        onCheckedChange={onFullAccessChange}
        tabIndex={-1}
      >
        <Text>{fullAccessLabel}</Text>
      </Checkbox>
    </Box>
  </Box>
);
