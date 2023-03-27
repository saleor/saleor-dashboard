import {
  Box,
  Dropdown,
  DropdownButton,
  List,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui/next";
import React, { MouseEvent } from "react";
import { useIntl } from "react-intl";

import { FilterPresetItem } from "./FilterPresetItem";
import { messages } from "./messages";

interface FilterPresetsSelectProps {
  activePreset: number;
  savedPresets: string[];
  selectAllLabel: string;
  isCustomPreset: boolean;
  onSelectAll: () => void;
  onRemove: (filterIndex: number) => void;
  onSelect: (filterIndex: number) => void;
}

export const FilterPresetsSelect = ({
  onSelect,
  onRemove,
  savedPresets,
  activePreset,
  onSelectAll,
  selectAllLabel,
  isCustomPreset,
}: FilterPresetsSelectProps) => {
  const intl = useIntl();

  const getLabel = () => {
    if (isCustomPreset) {
      return `(${intl.formatMessage(messages.unsavedPreset)})`;
    }

    if (activePreset === 0) {
      return selectAllLabel;
    }

    if (activePreset) {
      return savedPresets[activePreset - 1];
    }

    return "";
  };

  const handleSelectPreset = (e: MouseEvent<HTMLElement>, index: number) => {
    const target = e.target as HTMLElement;
    // Only allow selecting the preset if the user clicks on the list item or the span
    if (!["LI", "SPAN"].includes(target.tagName)) {
      return;
    }

    onSelect(index);
  };

  return (
    <Box display="flex" alignItems="center">
      <Text
        variant="caption"
        className={sprinkles({
          marginRight: 4,
        })}
      >
        {intl.formatMessage(messages.filterPreset)}
      </Text>
      <Dropdown>
        <Dropdown.Trigger>
          <DropdownButton data-test-id="show-saved-filters-button">
            {getLabel()}
          </DropdownButton>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Box __width="195px">
            <List
              padding={3}
              borderRadius={3}
              boxShadow="overlay"
              borderColor="neutralHighlight"
              borderStyle="solid"
              borderWidth={1}
              width="100%"
              marginTop={2}
              backgroundColor="surfaceNeutralPlain"
            >
              <Dropdown.Item>
                <List.Item
                  paddingX={4}
                  paddingY={3}
                  gap={6}
                  borderRadius={3}
                  onClick={onSelectAll}
                >
                  <Text variant={activePreset === 0 ? "bodyStrong" : "body"}>
                    {selectAllLabel}
                  </Text>
                </List.Item>
              </Dropdown.Item>
              {savedPresets.length > 0 && (
                <Box
                  height={1}
                  marginY={3}
                  __backgroundColor={vars.colors.border.neutralHighlight}
                  __marginLeft={-4}
                  __width="calc(100% + 8px)"
                />
              )}
              <Box display="flex" flexDirection="column" gap={2}>
                {savedPresets.map((preset, index) => (
                  <FilterPresetItem
                    isActive={activePreset === index + 1}
                    onSelect={e => handleSelectPreset(e, index + 1)}
                    onRemove={() => {
                      onRemove(index + 1);
                    }}
                  >
                    {preset}
                  </FilterPresetItem>
                ))}
              </Box>
            </List>
          </Box>
        </Dropdown.Content>
      </Dropdown>
    </Box>
  );
};
