import {
  Box,
  Dropdown,
  DropdownButton,
  List,
  RemoveIcon,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface SelectSavedFiltersProps {
  selectedSavedFilter: number;
  savedFilters: string[];
  selectAllLabel: string;
  isCustom: boolean;
  selectAllSavedFilters: () => void;
  onRemoveSavedFilter: (filterIndex: number) => void;
  onSelectSavedFilter: (filterIndex: number) => void;
}

export const SelectSavedFilters = ({
  onSelectSavedFilter,
  onRemoveSavedFilter,
  savedFilters,
  selectedSavedFilter,
  selectAllSavedFilters,
  selectAllLabel,
  isCustom,
}: SelectSavedFiltersProps) => {
  const intl = useIntl();
  const getSelectedSavedFilterLabel = () => {
    if (isCustom) {
      return `(${intl.formatMessage({
        defaultMessage: "Unsaved preset",
        id: "A+g/VP",
      })})`;
    }

    if (selectedSavedFilter === 0) {
      return selectAllLabel;
    }

    if (selectedSavedFilter) {
      return savedFilters[selectedSavedFilter - 1];
    }

    return "";
  };

  return (
    <Box display="flex" alignItems="center">
      <Text
        variant="caption"
        className={sprinkles({
          marginRight: 4,
        })}
      >
        {intl.formatMessage({ defaultMessage: "Filter preset", id: "3PVGWj" })}
      </Text>
      <Dropdown>
        <Dropdown.Trigger>
          <DropdownButton data-test-id="show-saved-filters-button">
            {getSelectedSavedFilterLabel()}
          </DropdownButton>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Box __width="195px">
            <List
              padding={3}
              borderRadius={3}
              boxShadow="overlay"
              borderColor={"neutralHighlight"}
              borderStyle="solid"
              borderWidth={1}
              width="100%"
              marginTop={2}
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
                  <Text variant="bodyStrong">{selectAllLabel}</Text>
                </List.Item>
              </Dropdown.Item>
              {savedFilters.length > 0 && (
                <Box
                  height={1}
                  marginY={2}
                  __backgroundColor={vars.colors.border.brandHighlight}
                  __marginLeft={-4}
                  __width="calc(100% + 8px)"
                />
              )}
              {savedFilters.map((preset, index) => (
                <FilterPresetItem
                  onSelect={() => onSelectSavedFilter(index + 1)}
                  onRemove={() => {
                    onRemoveSavedFilter(index + 1);
                  }}
                >
                  {preset}
                </FilterPresetItem>
              ))}
            </List>
          </Box>
        </Dropdown.Content>
      </Dropdown>
    </Box>
  );
};

interface FilterPresetItemProps {
  onSelect: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}

const FilterPresetItem = ({
  children,
  onSelect,
  onRemove,
}: FilterPresetItemProps) => {
  const [hasHover, setHasHover] = React.useState(false);

  return (
    <Box
      onMouseOver={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
    >
      <Dropdown.Item>
        <List.Item
          paddingX={5}
          paddingY={5}
          gap={6}
          borderRadius={3}
          display="flex"
          justifyContent="space-between"
          onClick={onSelect}
        >
          <Text>{children}</Text>
          {hasHover && (
            <Box
              onClick={e => {
                e.stopPropagation();
                onRemove();
              }}
              display="flex"
              alignItems="center"
            >
              <RemoveIcon
                className={sprinkles({
                  color: {
                    default: "iconNeutralSubdued",
                    hover: "iconNeutralPlain",
                  },
                })}
              />
            </Box>
          )}
        </List.Item>
      </Dropdown.Item>
    </Box>
  );
};
