import { attributeAddUrl, AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { configurationMenuUrl } from "@dashboard/configuration";
import { AttributeFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Card } from "@material-ui/core";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FilterPagePropsWithPresets, PageListProps, SortPage } from "../../../types";
import { AttributeListDatagrid } from "../AttributeListDatagrid";
import { AttributeFilterKeys, AttributeListFilterOpts, createFilterStructure } from "./filters";

export interface AttributeListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<AttributeFilterKeys, AttributeListFilterOpts>,
    SortPage<AttributeListUrlSortField> {
  attributes: AttributeFragment[];
  selectedAttributesIds: string[];
  onAttributesDelete: () => void;
  onSelectAttributesIds: (rows: number[], clearSelection: () => void) => void;
}

const AttributeListPage: React.FC<AttributeListPageProps> = ({
  filterOpts,
  initialSearch,
  onFilterChange,
  onSearchChange,
  hasPresetsChanged,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  filterPresets,
  selectedFilterPreset,
  onAttributesDelete,
  selectedAttributesIds,
  currencySymbol,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const structure = createFilterStructure(intl, filterOpts);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <>
      <TopNav
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.attributes)}
        withoutBorder
        isAlignToRight={false}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onFilterPresetChange}
              onRemove={onFilterPresetDelete}
              onUpdate={onFilterPresetUpdate}
              savedPresets={filterPresets}
              activePreset={selectedFilterPreset}
              onSelectAll={onFilterPresetsAll}
              onSave={onFilterPresetPresetSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "I+1KzL",
                defaultMessage: "All attributes",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              onClick={() => navigate(attributeAddUrl())}
              variant="primary"
              data-test-id="create-attribute-button"
            >
              <FormattedMessage
                id="IGvQ8k"
                defaultMessage="Create attribute"
                description="button"
              />
            </Button>
          </Box>
        </Box>
      </TopNav>
      <Card>
        <ListFilters<AttributeFilterKeys>
          currencySymbol={currencySymbol}
          initialSearch={initialSearch}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          filterStructure={structure}
          searchPlaceholder={intl.formatMessage({
            id: "9ScmSs",
            defaultMessage: "Search attributes...",
          })}
          actions={
            <Box display="flex" gap={4}>
              {selectedAttributesIds.length > 0 && (
                <BulkDeleteButton onClick={onAttributesDelete}>
                  <FormattedMessage defaultMessage="Delete attributes" id="g0GAdN" />
                </BulkDeleteButton>
              )}
            </Box>
          }
        />

        <AttributeListDatagrid {...listProps} />
      </Card>
    </>
  );
};
AttributeListPage.displayName = "AttributeListPage";
export default AttributeListPage;
