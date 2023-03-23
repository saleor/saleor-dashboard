import { Dropdown, DropdownButton, List, Text } from "@saleor/macaw-ui/next";
import React from "react";

const commonProps = {
  paddingX: 5,
  paddingY: 5,
  gap: 6,
  borderRadius: 3,
} as const;

export const SelectSavedFilters = () => (
  <Dropdown>
    <Dropdown.Trigger>
      <DropdownButton data-test-id="show-saved-filters-button">
        Saved filters
      </DropdownButton>
    </Dropdown.Trigger>
    <Dropdown.Content align="start">
      <List
        padding={3}
        borderRadius={3}
        boxShadow="overlay"
        backgroundColor="surfaceNeutralPlain"
      >
        <Dropdown.Item>
          <List.Item {...commonProps}>
            <Text>First item</Text>
          </List.Item>
        </Dropdown.Item>
        <Dropdown.Item>
          <List.Item {...commonProps}>
            <Text>Second item</Text>
          </List.Item>
        </Dropdown.Item>
      </List>
    </Dropdown.Content>
  </Dropdown>
);
