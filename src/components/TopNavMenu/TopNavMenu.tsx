import {
  Box,
  Button,
  ConfigurationIcon,
  Dropdown,
  List,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

interface TopNavMenuItem {
  label: string;
  testId?: string;
  onSelect: () => void;
}

interface TopNavMenuProps {
  items: TopNavMenuItem[];
  dataTestId?: string;
}

export const TopNavMenu: React.FC<TopNavMenuProps> = ({
  items,
  dataTestId,
}) => (
  <Dropdown data-test-id={dataTestId}>
    <Dropdown.Trigger>
      <Button
        icon={<ConfigurationIcon />}
        variant="secondary"
        data-test-id="show-more-button"
      />
    </Dropdown.Trigger>
    <Dropdown.Content align="end">
      <Box>
        <List
          padding={5}
          borderRadius={4}
          boxShadow="overlay"
          backgroundColor="surfaceNeutralPlain"
        >
          {items.map(item => (
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
