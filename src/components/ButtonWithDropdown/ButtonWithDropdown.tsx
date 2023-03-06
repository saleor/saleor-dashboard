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
}

export const ButtonWithDropdown: React.FC<ButtonWithDropdownProps> = ({
  onClick,
  options,
  children,
  testId,
}) => (
  <Dropdown>
    <Dropdown.Trigger>
      <Button data-test-id={testId} onClick={onClick}>
        {children}
        <ChervonDownIcon />
      </Button>
    </Dropdown.Trigger>
    <Dropdown.Content align="end">
      <Box>
        <List
          padding={5}
          borderRadius={4}
          boxShadow="overlay"
          backgroundColor="surfaceNeutralPlain"
        >
          {options.map(item => (
            <Dropdown.Item>
              <List.Item
                borderRadius={4}
                paddingX={4}
                paddingY={5}
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
