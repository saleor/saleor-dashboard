import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { configurationMenuUrl } from "@dashboard/configuration/urls";
import { CustomerTypeList } from "@dashboard/customerTypes/components/CustomerTypeList/CustomerTypeList";
import { type CustomerTypeListUrlSortField } from "@dashboard/customerTypes/urls";
import { type CustomerTypeFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import {
  type PageListProps,
  type SearchPageProps,
  type SortPage,
  type TabPageProps,
} from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface CustomerTypeListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<CustomerTypeListUrlSortField>,
    Omit<TabPageProps, "onTabDelete"> {
  customerTypes: CustomerTypeFragment[];
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (id: number) => void;
  hasPresetsChanged: () => boolean;
  onCreateCustomerType: () => void;
}

export const CustomerTypeListPage = ({
  currentTab,
  initialSearch,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  onTabUpdate,
  hasPresetsChanged,
  tabs,
  onCreateCustomerType,
  disabled,
  ...listProps
}: CustomerTypeListPageProps) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <ListPageLayout>
      <TopNav
        isAlignToRight={false}
        withoutBorder
        href={configurationMenuUrl}
        hrefIcon={<TopNavDestinationIcon.configuration />}
        hrefTitle={intl.formatMessage(topNavDestinationMessages.configuration)}
        title={intl.formatMessage(sectionNames.customerTypes)}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onTabUpdate}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "wBEqqa",
                defaultMessage: "All customer types",
                description: "select all customer types preset label",
              })}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            onClick={onCreateCustomerType}
            disabled={disabled}
            variant="primary"
            data-test-id="create-customer-type"
          >
            <FormattedMessage
              id="qC83EA"
              defaultMessage="Create customer type"
              description="button"
            />
          </Button>
        </Box>
      </TopNav>
      <Box paddingX={6}>
        <CustomerTypeList
          {...listProps}
          disabled={disabled}
          search={{
            placeholder: intl.formatMessage({
              id: "MUjTkk",
              defaultMessage: "Search customer types...",
            }),
            initialValue: initialSearch,
            onSearchChange,
          }}
        />
      </Box>
    </ListPageLayout>
  );
};

CustomerTypeListPage.displayName = "CustomerTypeListPage";
