import { Box, Button, ConfigurationIcon, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface TopNavMenuItem {
  label: string;
  testId?: string;
  onSelect: <T>(params?: T) => void;
}

interface TopNavMenuProps {
  items: TopNavMenuItem[];
  dataTestId?: string;
}

export const Menu: React.FC<TopNavMenuProps> = ({ items, dataTestId }) => (
  <Dropdown data-test-id={dataTestId}>
    <Dropdown.Trigger>
      <Button icon={<ConfigurationIcon />} variant="secondary" data-test-id="show-more-button" />
    </Dropdown.Trigger>
    <Dropdown.Content align="end">
      <Box>
        <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
          {items.map(item => (
            <Dropdown.Item key={item.label}>
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
