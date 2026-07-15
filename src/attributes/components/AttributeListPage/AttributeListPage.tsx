import { rippleAttributeListGroupByType } from "@dashboard/attributes/ripples/attributeListGroupByType";
import { attributeAddUrl, type AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { BulkUnassignButton } from "@dashboard/components/BulkUnassignButton";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { type AttributeFragment, type AttributeTypeEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  type ModelTypeTabCount,
  ModelTypeTabs,
} from "@dashboard/modeling/components/ModelTypeTabs/ModelTypeTabs";
import { type ModelTypeTabGrouping } from "@dashboard/modeling/components/ModelTypeTabs/useModelTypeTabGrouping";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type FilterPagePropsWithPresets, type PageListProps, type SortPage } from "../../../types";
import { AttributeListDatagrid } from "../AttributeListDatagrid";
import { type AttributeFilterKeys, type AttributeListFilterOpts } from "./filters";
import { attributeListPageMessages } from "./messages";

interface AttributeListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<AttributeFilterKeys, AttributeListFilterOpts>,
    SortPage<AttributeListUrlSortField> {
  attributes: AttributeFragment[];
  selectedAttributesIds: string[];
  builtInFilterPresets?: string[];
  defaultAttributeType?: AttributeTypeEnum;
  hidePagination?: boolean;
  canGroupByType?: boolean;
  groupByType?: boolean;
  onGroupByTypeChange?: (enabled: boolean) => void;
  showTypeTabs?: boolean;
  types?: Array<{ id: string; name: string }>;
  selectedTypeIds?: string[];
  typeTabCounts?: Record<string, ModelTypeTabCount | undefined>;
  onTypeTabChange?: (ids: string[]) => void;
  typeTabGrouping?: ModelTypeTabGrouping;
  onAttributesDelete: () => void;
  onAttributesUnassign?: () => void;
  canUnassignFromType?: boolean;
  onSelectAttributesIds: (rows: number[], clearSelection: () => void) => void;
}

const AttributeListPage = ({
  initialSearch,
  onSearchChange,
  hasPresetsChanged,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetPresetSave,
  onFilterPresetUpdate,
  onFilterPresetsAll,
  filterPresets,
  builtInFilterPresets = [],
  defaultAttributeType,
  selectedFilterPreset,
  onAttributesDelete,
  onAttributesUnassign,
  canUnassignFromType = false,
  selectedAttributesIds,
  onSelectAttributesIds,
  hidePagination = false,
  canGroupByType = false,
  groupByType = true,
  onGroupByTypeChange,
  showTypeTabs = false,
  types,
  selectedTypeIds = [],
  typeTabCounts = {},
  onTypeTabChange,
  typeTabGrouping,
  ...listProps
}: AttributeListPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
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
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onFilterPresetChange}
              onRemove={onFilterPresetDelete}
              onUpdate={onFilterPresetUpdate}
              builtInPresets={builtInFilterPresets}
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
          <Box display="flex" alignItems="center" gap={2}>
            {canGroupByType && onGroupByTypeChange && (
              <Box position="relative">
                <TopNav.Menu
                  dataTestId="attribute-list-view-menu"
                  items={[
                    {
                      label: intl.formatMessage(attributeListPageMessages.groupByType),
                      testId: "attribute-list-group-by-type",
                      checked: groupByType,
                      onSelect: () => onGroupByTypeChange(!groupByType),
                    },
                  ]}
                />
                <Box position="absolute" __top="-4px" __right="-4px">
                  <Ripple model={rippleAttributeListGroupByType} />
                </Box>
              </Box>
            )}
            <Button
              onClick={() =>
                navigate(
                  defaultAttributeType
                    ? attributeAddUrl({ type: defaultAttributeType })
                    : attributeAddUrl(),
                )
              }
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
      <Box display="flex" flexDirection="column" __minWidth={0} __minHeight={0}>
        <Box paddingTop={4}>
          <ListFilters<AttributeFilterKeys>
            type="expression-filter"
            initialSearch={initialSearch}
            onSearchChange={onSearchChange}
            searchPlaceholder={intl.formatMessage({
              id: "9ScmSs",
              defaultMessage: "Search attributes...",
            })}
            actions={
              <Box display="flex" gap={4}>
                {canUnassignFromType &&
                  onAttributesUnassign &&
                  selectedAttributesIds.length > 0 && (
                    <BulkUnassignButton onClick={onAttributesUnassign}>
                      {intl.formatMessage(attributeListPageMessages.unassignAttributes)}
                    </BulkUnassignButton>
                  )}
                {selectedAttributesIds.length > 0 && (
                  <BulkDeleteButton onClick={onAttributesDelete}>
                    <FormattedMessage defaultMessage="Delete attributes" id="g0GAdN" />
                  </BulkDeleteButton>
                )}
              </Box>
            }
          />
        </Box>
        {showTypeTabs && onTypeTabChange && typeTabGrouping && (
          <ModelTypeTabs
            pageTypes={types}
            selectedIds={selectedTypeIds}
            counts={typeTabCounts}
            onTabChange={onTypeTabChange}
            grouping={typeTabGrouping}
          />
        )}
        <DashboardCard>
          <AttributeListDatagrid
            {...listProps}
            hidePagination={hidePagination}
            showTopBorder={!showTypeTabs}
            onSelectAttributesIds={onSelectAttributesIds}
          />
        </DashboardCard>
      </Box>
    </>
  );
};

AttributeListPage.displayName = "AttributeListPage";
export default AttributeListPage;
