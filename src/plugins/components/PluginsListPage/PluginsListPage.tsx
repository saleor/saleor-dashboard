// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ExternalLinkNext } from "@dashboard/components/ExternalLink";
import FilterBar from "@dashboard/components/FilterBar";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { configurationMenuUrl } from "@dashboard/configuration";
import { PluginBaseFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { getStatusColor } from "@dashboard/misc";
import { PluginListUrlSortField } from "@dashboard/plugins/urls";
import { FilterPageProps, PageListProps, SortPage, TabPageProps } from "@dashboard/types";
import { Card } from "@material-ui/core";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import PluginsList from "../PluginsList/PluginsList";
import { createFilterStructure, PluginFilterKeys, PluginListFilterOpts } from "./filters";
import { pluginsFilterErrorMessages, pluginsListPageMessages } from "./messages";

export interface PluginsListPageProps
  extends PageListProps,
    FilterPageProps<PluginFilterKeys, PluginListFilterOpts>,
    SortPage<PluginListUrlSortField>,
    TabPageProps {
  plugins: PluginBaseFragment[];
}

const PluginsListPage: React.FC<PluginsListPageProps> = ({
  currentTab,
  initialSearch,
  filterOpts,
  tabs,
  onAll,
  onSearchChange,
  onFilterChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  ...listProps
}) => {
  const intl = useIntl();
  const { theme: currentTheme } = useTheme();
  const filterStructure = createFilterStructure(intl, filterOpts);

  return (
    <ListPageLayout>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.plugins)} />
      <Card>
        <div>
          <Box
            paddingX={7}
            paddingY={5}
            marginBottom={5}
            __backgroundColor={getStatusColor({
              status: "warning",
              currentTheme,
            })}
          >
            <Text size={5} fontWeight="bold" as="h2">
              {intl.formatMessage(pluginsListPageMessages.warningHeadline)}
            </Text>
            <Text>
              {intl.formatMessage(pluginsListPageMessages.appStoreWarning)}{" "}
              <ExternalLinkNext
                target="_blank"
                href="https://docs.saleor.io/docs/3.x/developer/app-store/overview"
              >
                Saleor App Store.
              </ExternalLinkNext>
            </Text>
          </Box>
        </div>
        <FilterBar
          errorMessages={pluginsFilterErrorMessages}
          currentTab={currentTab}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          tabs={tabs}
          allTabLabel={intl.formatMessage({
            id: "aOelhW",
            defaultMessage: "All Plugins",
            description: "tab name",
          })}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            id: "BtErCZ",
            defaultMessage: "Search Plugins...",
          })}
        />
        <PluginsList {...listProps} />
      </Card>
    </ListPageLayout>
  );
};

PluginsListPage.displayName = "PluginsListPage";
export default PluginsListPage;
