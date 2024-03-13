import { commonMessages } from "@dashboard/intl";
import {
  Box,
  Button,
  Dropdown,
  DropdownButton,
  List,
  PlusIcon,
  sprinkles,
  Text,
  Tooltip,
  vars,
} from "@saleor/macaw-ui-next";
import React, { MouseEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FilterPresetItem } from "./FilterPresetItem";
import { messages } from "./messages";
import { getSeparatorWidth } from "./utils";

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
  const intl = useIntl();
  const showUpdateButton =
    presetsChanged && savedPresets.length > 0 && activePreset;

  const showSaveButton = presetsChanged;

  const getLabel = () => {
    if (!activePreset) {
      return selectAllLabel;
    }

    return savedPresets[activePreset - 1];
  };

  const handleSelectPreset = (e: MouseEvent<HTMLElement>, index: number) => {
    const target = e.target as HTMLElement;
    // Prevent run onSelect when click on remove button
    if (!["LI", "SPAN"].includes(target.tagName)) {
      return;
    }

    onSelect(index);
  };

  const renderDropdown = () => {
    if (!savedPresets?.length) {
      return (
        <Box display="flex" alignItems="center">
          <Tooltip>
            <Tooltip.Trigger>
              <Text typeSize={6}>{selectAllLabel}</Text>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Arrow />
              {intl.formatMessage(messages.noPresets)}
            </Tooltip.Content>
          </Tooltip>
        </Box>
      );
    }

    return (
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
            size="medium"
            data-test-id="show-saved-filters-button"
            style={{
              borderColor: isOpen ? vars.colors.border.accent1 : undefined,
            }}
          >
            <Box __maxWidth="200px">
              <Text ellipsis typeSize={6} display="block">
                {getLabel()}
              </Text>
            </Box>
          </DropdownButton>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <List
            __maxWidth={250}
            __minWidth={175}
            __maxHeight={400}
            overflowY="auto"
            padding={1}
            borderRadius={3}
            boxShadow="defaultOverlay"
            borderColor="default1"
            borderStyle="solid"
            borderWidth={1}
            width="100%"
            marginTop={0.5}
            backgroundColor="default1"
          >
            <Dropdown.Item>
              <List.Item
                paddingX={1.5}
                paddingY={1}
                gap={3}
                borderRadius={3}
                onClick={onSelectAll}
              >
                <Text fontWeight={activePreset === 0 ? "bold" : "regular"}>
                  {selectAllLabel}
                </Text>
              </List.Item>
            </Dropdown.Item>
            {savedPresets.length > 0 && (
              <Box
                height="px"
                marginY={1}
                __backgroundColor={vars.colors.border.default1}
                __marginLeft={-4}
                __width={getSeparatorWidth("4px")}
              />
            )}
            <Box display="flex" flexDirection="column" gap={0.5}>
              {savedPresets.map((preset, index) => (
                <FilterPresetItem
                  isActive={activePreset === index + 1}
                  onSelect={e => handleSelectPreset(e, index + 1)}
                  onRemove={() => {
                    onRemove(index + 1);
                  }}
                  key={`filter-preset-${index}`}
                >
                  {preset}
                </FilterPresetItem>
              ))}
            </Box>
          </List>
        </Dropdown.Content>
      </Dropdown>
    );
  };

  return (
    <Box display="flex" alignItems="center">
      {renderDropdown()}
      {showUpdateButton && (
        <Button
          data-test-id="update-preset-button"
          className={sprinkles({
            marginLeft: 3,
          })}
          onClick={() => onUpdate(savedPresets[activePreset - 1])}
          variant="secondary"
          size="small"
        >
          <FormattedMessage {...commonMessages.update} />
        </Button>
      )}
      {showSaveButton && (
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              data-test-id="add-preset-button"
              className={sprinkles({
                marginLeft: 3,
              })}
              icon={<PlusIcon />}
              onClick={onSave}
              variant="secondary"
              size="small"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            {intl.formatMessage(messages.savePreset)}
          </Tooltip.Content>
        </Tooltip>
      )}
    </Box>
  );
};
