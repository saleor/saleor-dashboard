import {
  Box,
  Button,
  Dropdown,
  DropdownButton,
  List,
  PlusIcon,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui/next";
import React, { MouseEvent } from "react";

import { FilterPresetItem } from "./FilterPresetItem";

interface FilterPresetsSelectProps {
  activePreset?: number;
  savedPresets: string[];
  selectAllLabel: string;
  isOpen?: boolean;
  presetsChanged?: boolean;
  onSave: () => void;
  onSelectAll: () => void;
  onRemove: (filterIndex: number) => void;
  onUpdate: (tabName: string) => void;
  onSelect: (filterIndex: number) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export const FilterPresetsSelect = ({
  onSelect,
  onRemove,
  onSave,
  savedPresets,
  activePreset,
  onSelectAll,
  selectAllLabel,
  isOpen,
  onUpdate,
  onOpenChange,
  presetsChanged,
}: FilterPresetsSelectProps) => {
  const getLabel = () => {
    if (!activePreset) {
      return selectAllLabel;
    }

    return savedPresets[activePreset - 1] ?? "";
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
      <Dropdown
        open={isOpen}
        onOpenChange={open => {
          if (onOpenChange) {
            onOpenChange(open);
          }
        }}
      >
        <Dropdown.Trigger>
          <DropdownButton
            variant="text"
            size="small"
            data-test-id="show-saved-filters-button"
          >
            <Box
              __maxWidth="200px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {getLabel()}
            </Box>
          </DropdownButton>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Box __maxWidth="250px" __minWidth="175px">
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
      {presetsChanged && activePreset && (
        <Button
          className={sprinkles({
            marginLeft: 6,
          })}
          onClick={() => onUpdate(savedPresets[activePreset - 1])}
          variant="secondary"
          size="small"
        >
          Update
        </Button>
      )}
      {presetsChanged && (
        <Button
          className={sprinkles({
            marginLeft: 6,
          })}
          icon={<PlusIcon />}
          onClick={onSave}
          variant="secondary"
          size="small"
        ></Button>
      )}
    </Box>
  );
};
