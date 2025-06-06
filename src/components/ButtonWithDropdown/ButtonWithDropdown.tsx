import {
  Box,
  Button,
  ButtonProps,
  ChervonDownIcon,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui-next";
import React from "react";

interface ButtonWithDropdownProps extends ButtonProps {
  onClick?: () => void;
  options: Array<{
    label: string;
    testId?: string;
    onSelect: <T>(params?: T) => void;
  }>;
  testId?: string;
  disabled?: boolean;
}

export const ButtonWithDropdown: React.FC<ButtonWithDropdownProps> = ({
  onClick,
  options,
  children,
  testId,
  disabled = false,
  ...buttonProps
}) => (
  <Dropdown>
    <Dropdown.Trigger>
      <Button data-test-id={testId} onClick={onClick} disabled={disabled} {...buttonProps}>
        {children}
        <ChervonDownIcon />
      </Button>
    </Dropdown.Trigger>
    <Dropdown.Content align="end">
      <Box>
        <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
          {options.map((item, idx) => (
            <Dropdown.Item key={`dropdown-item-${idx}`}>
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
