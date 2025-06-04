import {
  Box,
  BoxProps,
  Button,
  ChervonDownIcon,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui-next";
import React from "react";

interface ButtonGroupWithDropdownProps extends BoxProps {
  onClick?: () => void;
  options: Array<{
    label: string;
    testId?: string;
    onSelect: <T>(params?: T) => void;
  }>;
  testId?: string;
  disabled?: boolean;
}

// TODO: consider moving this to Macaw UI
export const ButtonGroupWithDropdown = ({
  children,
  options,
  onClick,
  disabled = false,
  testId,
  ...boxProps
}: ButtonGroupWithDropdownProps) => {
  return (
    <Dropdown>
      <Box display="flex" {...boxProps}>
        <Button
          onClick={onClick}
          data-test-id={testId}
          disabled={disabled}
          // TODO: fix this in Macaw UI - allow overriding border radius
          __borderBottomRightRadius={0}
          __borderTopRightRadius={0}
        >
          {children}
        </Button>

        <Dropdown.Trigger>
          <Button
            icon={<ChervonDownIcon />}
            disabled={disabled}
            borderColor="default1"
            borderLeftWidth={1}
            borderLeftStyle="solid"
            __borderBottomLeftRadius={0}
            __borderTopLeftRadius={0}
          />
        </Dropdown.Trigger>
      </Box>

      <Dropdown.Content align="end">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {options.map((item, idx) => (
              <Dropdown.Item key={`button-group-dropdown-item-${idx}`}>
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
};
