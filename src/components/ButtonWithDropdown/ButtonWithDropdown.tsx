import {
  Box,
  Button,
  ChervonDownIcon,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

interface ButtonWithDropdownProps {
  onClick: () => void;
  options: Array<{ label: string; testId: string; onSelect: () => void }>;
  testId?: string;
  disabled?: boolean;
}

export const ButtonWithDropdown: React.FC<ButtonWithDropdownProps> = ({
  onClick,
  options,
  children,
  testId,
  disabled = false,
}) => (
  <Dropdown>
    <Dropdown.Trigger>
      <Button data-test-id={testId} onClick={onClick} disabled={disabled}>
        {children}
        <ChervonDownIcon />
      </Button>
    </Dropdown.Trigger>
    <Dropdown.Content align="end">
      <Box>
        <List
          padding={2}
          borderRadius={4}
          boxShadow="overlay"
          backgroundColor="surfaceNeutralPlain"
        >
          {options.map(item => (
            <Dropdown.Item>
              <List.Item
                borderRadius={4}
                paddingX={1.5}
                paddingY={2}
                onClick={item.onSelect}
                data-test-id={item.testId}
              >
                <Text>{item.label}</Text>
              </List.Item>
            </Dropdown.Item>
          ))}
        </List>
      </Box>
    </Dropdown.Content>
  </Dropdown>
);
