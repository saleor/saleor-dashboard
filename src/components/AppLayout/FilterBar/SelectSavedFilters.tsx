import { Dropdown, DropdownButton, List, Text } from "@saleor/macaw-ui/next";
import React from "react";

interface SelectSavedFiltersProps {
  selectedSavedFilter: number;
  savedFilters: string[];
  selectAllLabel: string;
  selectAllSavedFilters: () => void;
  onSelectSavedFilter: (filterIndex: number) => void;
}

export const SelectSavedFilters = ({
  onSelectSavedFilter,
  savedFilters,
  selectedSavedFilter,
  selectAllSavedFilters,
  selectAllLabel,
}: SelectSavedFiltersProps) => {
  const getSelectedSavedFilterLabel = () => {
    if (selectedSavedFilter === 0) {
      return selectAllLabel;
    }

    if (selectedSavedFilter) {
      return savedFilters[selectedSavedFilter - 1];
    }

    return "";
  };

  if (savedFilters?.length === 0) {
    return null;
  }

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <DropdownButton data-test-id="show-saved-filters-button">
          {getSelectedSavedFilterLabel()}
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
            <List.Item
              paddingX={5}
              paddingY={5}
              gap={6}
              borderRadius={3}
              onClick={selectAllSavedFilters}
            >
              <Text>{selectAllLabel}</Text>
            </List.Item>
          </Dropdown.Item>
          {savedFilters.map((preset, index) => (
            <Dropdown.Item>
              <List.Item
                paddingX={5}
                paddingY={5}
                gap={6}
                borderRadius={3}
                onClick={() => onSelectSavedFilter(index + 1)}
              >
                <Text>{preset}</Text>
              </List.Item>
            </Dropdown.Item>
          ))}
        </List>
      </Dropdown.Content>
    </Dropdown>
  );
};
