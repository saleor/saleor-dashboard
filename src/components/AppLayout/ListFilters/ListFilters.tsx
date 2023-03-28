import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { FilterProps, SearchPageProps, TabPageProps } from "@dashboard/types";
import { Tooltip } from "@saleor/macaw-ui";
import { Box, Button, FloppyDiscIcon, sprinkles } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";
import { useIntl } from "react-intl";

import { FiltersSelect } from "./components/FiltersSelect";
import SearchInput from "./components/SearchInput";

export interface ListFiltersProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    TabPageProps,
    SearchPageProps {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
  actions?: ReactNode;
  selectAllLabel: string;
}

export const ListFilters = ({
  currencySymbol,
  filterStructure,
  initialSearch,
  searchPlaceholder,
  onSearchChange,
  onFilterChange,
  onFilterAttributeFocus,
  errorMessages,
  actions,
  tabs,
  currentTab,
  selectAllLabel,
  onAll,
  onTabChange,
  onTabDelete,
  onTabSave,
}: ListFiltersProps) => {
  const intl = useIntl();
  const isCustom = currentTab === tabs.length + 1;

  return (
    <>
      <Box
        display="grid"
        __gridTemplateColumns="repeat(2, 1fr)"
        gap={7}
        paddingBottom={5}
        paddingX={9}
        borderColor="neutralPlain"
        borderBottomStyle="solid"
        borderBottomWidth={1}
      >
        <Box display="flex" alignItems="center" gap={7}>
          <FiltersSelect
            errorMessages={errorMessages}
            menu={filterStructure}
            currencySymbol={currencySymbol}
            onFilterAdd={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
          />

          <Box __width="320px">
            <SearchInput
              initialSearch={initialSearch}
              placeholder={searchPlaceholder}
              onSearchChange={onSearchChange}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box marginRight={11} display="flex" alignItems="center">
            <FilterPresetsSelect
              isCustomPreset={isCustom}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              selectAllLabel={selectAllLabel}
            />
            {isCustom && (
              <Tooltip
                title={intl.formatMessage({
                  defaultMessage: "Save preset",
                  id: "iLQJv1",
                })}
              >
                <Button
                  onClick={onTabSave}
                  className={sprinkles({ marginLeft: 5 })}
                  icon={<FloppyDiscIcon />}
                  variant="tertiary"
                  size="medium"
                />
              </Tooltip>
            )}
          </Box>

          {actions}
        </Box>
      </Box>
    </>
  );
};
ListFilters.displayName = "FilterBar";
